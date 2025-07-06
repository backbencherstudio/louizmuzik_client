import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        // Verificar autenticación
        const cookieStore = cookies();
        const supabaseToken = cookieStore.get('sb-token')?.value;

        if (!supabaseToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Obtener el usuario actual
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser(supabaseToken);

        if (userError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verificar que el usuario es PRO
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_pro')
            .eq('id', user.id)
            .single();

        if (profileError || !profile?.is_pro) {
            return NextResponse.json(
                { error: 'Only PRO users can access analytics' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || '30d'; // '7d', '30d', '90d', 'custom'
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Calcular fechas para el rango seleccionado
        let dateFilter = new Date();
        switch (timeRange) {
            case '7d':
                dateFilter.setDate(dateFilter.getDate() - 7);
                break;
            case '30d':
                dateFilter.setDate(dateFilter.getDate() - 30);
                break;
            case '90d':
                dateFilter.setDate(dateFilter.getDate() - 90);
                break;
            case 'custom':
                if (startDate && endDate) {
                    dateFilter = new Date(startDate);
                }
                break;
        }

        // Consultas en paralelo para diferentes métricas
        const [melodiesPlays, melodiesDownloads, packSales, followers] =
            await Promise.all([
                // Reproducciones de melodías
                supabase
                    .from('melody_plays')
                    .select('created_at', { count: 'exact' })
                    .eq('producer_id', user.id)
                    .gte('created_at', dateFilter.toISOString()),

                // Descargas de melodías
                supabase
                    .from('melody_downloads')
                    .select('created_at', { count: 'exact' })
                    .eq('producer_id', user.id)
                    .gte('created_at', dateFilter.toISOString()),

                // Ventas de packs
                supabase
                    .from('pack_sales')
                    .select(
                        `
                    *,
                    packs (
                        title,
                        price
                    )
                `
                    )
                    .eq('producer_id', user.id)
                    .eq('status', 'completed')
                    .gte('created_at', dateFilter.toISOString()),

                // Seguidores
                supabase
                    .from('producer_follows')
                    .select('created_at', { count: 'exact' })
                    .eq('producer_id', user.id)
                    .gte('created_at', dateFilter.toISOString()),
            ]);

        // Verificar errores
        if (
            melodiesPlays.error ||
            melodiesDownloads.error ||
            packSales.error ||
            followers.error
        ) {
            return NextResponse.json(
                { error: 'Error fetching analytics data' },
                { status: 400 }
            );
        }

        // Calcular métricas de ventas
        const salesMetrics = {
            total_sales: packSales.data.length,
            total_revenue: packSales.data.reduce(
                (sum, sale) => sum + sale.total_amount,
                0
            ),
            total_commission: packSales.data.reduce(
                (sum, sale) => sum + sale.commission_amount,
                0
            ),
            net_revenue: packSales.data.reduce(
                (sum, sale) => sum + sale.producer_amount,
                0
            ),
            sales_by_pack: packSales.data.reduce((acc, sale) => {
                const packTitle = sale.packs.title;
                acc[packTitle] = (acc[packTitle] || 0) + 1;
                return acc;
            }, {}),
        };

        // Agrupar datos por día para gráficos
        const dailyData = packSales.data.reduce((acc, sale) => {
            const date = sale.created_at.split('T')[0];
            if (!acc[date]) {
                acc[date] = {
                    sales: 0,
                    revenue: 0,
                };
            }
            acc[date].sales++;
            acc[date].revenue += sale.producer_amount;
            return acc;
        }, {});

        return NextResponse.json({
            overview: {
                total_plays: melodiesPlays.count || 0,
                total_downloads: melodiesDownloads.count || 0,
                total_sales: salesMetrics.total_sales,
                total_revenue: salesMetrics.total_revenue,
                total_commission: salesMetrics.total_commission,
                net_revenue: salesMetrics.net_revenue,
                new_followers: followers.count || 0,
            },
            sales_metrics: salesMetrics,
            daily_data: Object.entries(dailyData).map(([date, data]) => ({
                date,
                ...data,
            })),
            timeRange,
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
