import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener estadísticas de ventas del productor
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

        // Verificar si el usuario es PRO
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'pro' && profile?.role !== 'admin') {
            return NextResponse.json(
                {
                    error: 'Unauthorized - Only PRO users can access sales statistics',
                },
                { status: 403 }
            );
        }

        // Obtener parámetros de consulta
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || '30'; // días por defecto
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeRange));
        const startDateStr = startDate.toISOString();

        // 1. Resumen general de ventas
        const { data: salesSummary } = await supabase
            .from('pack_sales')
            .select(
                `
                id,
                amount,
                commission_amount,
                created_at,
                pack:sample_packs!inner (
                    id,
                    title,
                    price
                )
            `
            )
            .eq('producer_id', user.id)
            .gte('created_at', startDateStr)
            .order('created_at', { ascending: false });

        // 2. Ventas por pack
        const { data: packStats } = await supabase
            .from('sample_packs')
            .select(
                `
                id,
                title,
                price,
                sales:pack_sales(count),
                total_amount:pack_sales(amount),
                total_commission:pack_sales(commission_amount)
            `
            )
            .eq('producer_id', user.id)
            .order('created_at', { ascending: false });

        // 3. Estadísticas de pagos
        const { data: paymentStats } = await supabase
            .from('producer_payments')
            .select(
                `
                id,
                status,
                amount,
                created_at,
                completed_at
            `
            )
            .eq('producer_id', user.id)
            .gte('created_at', startDateStr)
            .order('created_at', { ascending: false });

        // 4. Estadísticas diarias
        const { data: dailyStats } = await supabase
            .from('daily_producer_stats')
            .select('*')
            .eq('producer_id', user.id)
            .gte('date', startDateStr)
            .order('date', { ascending: false });

        // Calcular totales y métricas
        const totalSales = salesSummary?.length || 0;
        const totalRevenue =
            salesSummary?.reduce((sum, sale) => sum + (sale.amount || 0), 0) ||
            0;
        const totalCommissions =
            salesSummary?.reduce(
                (sum, sale) => sum + (sale.commission_amount || 0),
                0
            ) || 0;
        const netEarnings = totalRevenue - totalCommissions;

        // Calcular promedios
        const averageOrderValue =
            totalSales > 0 ? totalRevenue / totalSales : 0;
        const dailyAverage =
            totalSales > 0 ? totalRevenue / parseInt(timeRange) : 0;

        // Calcular tendencias
        const salesByDay =
            dailyStats?.reduce((acc: any, stat) => {
                acc[stat.date] = {
                    sales: stat.sales_count,
                    revenue: stat.revenue,
                    commission: stat.commission,
                };
                return acc;
            }, {}) || {};

        // Construir respuesta
        const response = {
            summary: {
                timeRange: parseInt(timeRange),
                totalSales,
                totalRevenue,
                totalCommissions,
                netEarnings,
                averageOrderValue,
                dailyAverage,
            },
            recentSales: salesSummary || [],
            packPerformance:
                packStats?.map((pack) => ({
                    id: pack.id,
                    title: pack.title,
                    price: pack.price,
                    salesCount: pack.sales,
                    totalRevenue: pack.total_amount,
                    totalCommissions: pack.total_commission,
                    netEarnings:
                        (pack.total_amount || 0) - (pack.total_commission || 0),
                })) || [],
            payments: {
                pending:
                    paymentStats?.filter((p) => p.status === 'pending')
                        ?.length || 0,
                processing:
                    paymentStats?.filter((p) => p.status === 'processing')
                        ?.length || 0,
                completed:
                    paymentStats?.filter((p) => p.status === 'completed')
                        ?.length || 0,
                failed:
                    paymentStats?.filter((p) => p.status === 'failed')
                        ?.length || 0,
                recentPayments: paymentStats || [],
            },
            dailyStats: salesByDay,
            bestSellingPacks:
                packStats
                    ?.sort((a, b) => (b.sales || 0) - (a.sales || 0))
                    .slice(0, 5)
                    .map((pack) => ({
                        id: pack.id,
                        title: pack.title,
                        salesCount: pack.sales,
                        revenue: pack.total_amount,
                    })) || [],
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in GET /api/producer/stats/sales:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
