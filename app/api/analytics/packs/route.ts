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

        // Obtener parámetros de consulta
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = searchParams.get('sortBy') || 'sales'; // 'sales', 'revenue', 'views'
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const timeRange = searchParams.get('timeRange') || '30d'; // '7d', '30d', '90d', 'all'

        // Calcular fecha de inicio según el rango
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
            case 'all':
                dateFilter = new Date(0); // Desde el inicio
                break;
        }

        // Obtener todos los packs del productor
        const { data: packs, error: packsError } = await supabase
            .from('packs')
            .select(
                `
                id,
                title,
                description,
                price,
                genre,
                created_at,
                is_active
            `
            )
            .eq('producer_id', user.id);

        if (packsError) {
            return NextResponse.json(
                { error: 'Error fetching packs' },
                { status: 400 }
            );
        }

        // Obtener estadísticas para cada pack
        const packsWithStats = await Promise.all(
            packs.map(async (pack) => {
                const [sales, views] = await Promise.all([
                    // Ventas completadas
                    supabase
                        .from('pack_sales')
                        .select(
                            `
                            created_at,
                            total_amount,
                            commission_amount,
                            producer_amount
                        `
                        )
                        .eq('pack_id', pack.id)
                        .eq('status', 'completed')
                        .gte('created_at', dateFilter.toISOString()),

                    // Vistas del pack
                    supabase
                        .from('pack_views')
                        .select('created_at', { count: 'exact' })
                        .eq('pack_id', pack.id)
                        .gte('created_at', dateFilter.toISOString()),
                ]);

                // Calcular métricas de ventas
                const totalSales = sales.data?.length || 0;
                const totalRevenue =
                    sales.data?.reduce(
                        (sum, sale) => sum + sale.total_amount,
                        0
                    ) || 0;
                const totalCommission =
                    sales.data?.reduce(
                        (sum, sale) => sum + sale.commission_amount,
                        0
                    ) || 0;
                const netRevenue =
                    sales.data?.reduce(
                        (sum, sale) => sum + sale.producer_amount,
                        0
                    ) || 0;

                // Calcular datos diarios para gráficos
                const dailyData = (sales.data || []).reduce(
                    (acc: any, sale) => {
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
                    },
                    {}
                );

                return {
                    ...pack,
                    stats: {
                        total_sales: totalSales,
                        total_revenue: totalRevenue,
                        total_commission: totalCommission,
                        net_revenue: netRevenue,
                        views: views.count || 0,
                        conversion_rate: views.count
                            ? (totalSales / views.count) * 100
                            : 0,
                    },
                    daily_data: Object.entries(dailyData).map(
                        ([date, data]) => ({
                            date,
                            ...data,
                        })
                    ),
                };
            })
        );

        // Ordenar resultados
        packsWithStats.sort((a, b) => {
            let valueA, valueB;
            switch (sortBy) {
                case 'sales':
                    valueA = a.stats.total_sales;
                    valueB = b.stats.total_sales;
                    break;
                case 'revenue':
                    valueA = a.stats.net_revenue;
                    valueB = b.stats.net_revenue;
                    break;
                case 'views':
                    valueA = a.stats.views;
                    valueB = b.stats.views;
                    break;
                default:
                    valueA = a.stats.total_sales;
                    valueB = b.stats.total_sales;
            }
            return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
        });

        // Aplicar paginación
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedResults = packsWithStats.slice(start, end);

        // Calcular totales
        const totals = packsWithStats.reduce(
            (acc, pack) => ({
                total_sales: acc.total_sales + pack.stats.total_sales,
                total_revenue: acc.total_revenue + pack.stats.total_revenue,
                total_commission:
                    acc.total_commission + pack.stats.total_commission,
                net_revenue: acc.net_revenue + pack.stats.net_revenue,
                total_views: acc.total_views + pack.stats.views,
            }),
            {
                total_sales: 0,
                total_revenue: 0,
                total_commission: 0,
                net_revenue: 0,
                total_views: 0,
            }
        );

        return NextResponse.json({
            packs: paginatedResults,
            totals,
            pagination: {
                page,
                limit,
                total: packsWithStats.length,
                totalPages: Math.ceil(packsWithStats.length / limit),
            },
            timeRange,
            sortBy,
            sortOrder,
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching pack analytics:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
