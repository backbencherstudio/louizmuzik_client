import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener reportes globales (solo admin)
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

        // Verificar si el usuario es admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Only admins can access reports' },
                { status: 403 }
            );
        }

        // Obtener parámetros de consulta
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || '30'; // días por defecto
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeRange));
        const startDateStr = startDate.toISOString();

        // 1. Estadísticas de usuarios
        const { data: userStats } = await supabase
            .from('profiles')
            .select('role', { count: 'exact' })
            .gte('created_at', startDateStr);

        const { data: proUsers } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' })
            .eq('role', 'pro')
            .gte('created_at', startDateStr);

        // 2. Estadísticas de melodías
        const { data: melodyStats } = await supabase
            .from('melodies')
            .select('id, active', { count: 'exact' })
            .gte('created_at', startDateStr);

        const { data: downloadStats } = await supabase
            .from('melody_downloads')
            .select('id', { count: 'exact' })
            .gte('created_at', startDateStr);

        // 3. Estadísticas de sample packs
        const { data: packStats } = await supabase
            .from('sample_packs')
            .select('id, active', { count: 'exact' })
            .gte('created_at', startDateStr);

        // 4. Estadísticas de ventas y comisiones
        const { data: salesStats } = await supabase
            .from('pack_sales')
            .select(
                `
                id,
                amount,
                commission_amount
            `
            )
            .gte('created_at', startDateStr);

        // 5. Estadísticas de colaboraciones
        const { data: collabStats } = await supabase
            .from('collaboration_agreements')
            .select('id, status', { count: 'exact' })
            .gte('created_at', startDateStr);

        // 6. Estadísticas diarias
        const { data: dailyStats } = await supabase
            .from('daily_stats')
            .select('*')
            .gte('date', startDateStr)
            .order('date', { ascending: false });

        // 7. Top productores
        const { data: topProducers } = await supabase
            .from('profiles')
            .select(
                `
                id,
                username,
                artist_name,
                melody_count:melodies(count),
                download_count:melody_downloads(count),
                follower_count:user_followers(count)
            `
            )
            .eq('role', 'pro')
            .order('follower_count', { ascending: false })
            .limit(10);

        // Calcular totales y porcentajes
        const totalUsers = userStats?.length || 0;
        const totalProUsers = proUsers?.length || 0;
        const proUserPercentage =
            totalUsers > 0 ? (totalProUsers / totalUsers) * 100 : 0;

        const totalSales =
            salesStats?.reduce((sum, sale) => sum + (sale.amount || 0), 0) || 0;
        const totalCommissions =
            salesStats?.reduce(
                (sum, sale) => sum + (sale.commission_amount || 0),
                0
            ) || 0;

        // Construir respuesta
        const report = {
            timeRange: parseInt(timeRange),
            users: {
                total: totalUsers,
                pro: totalProUsers,
                proPercentage: proUserPercentage,
                growth: dailyStats?.[0]?.new_users || 0,
            },
            melodies: {
                total: melodyStats?.length || 0,
                active: melodyStats?.filter((m) => m.active)?.length || 0,
                downloads: downloadStats?.length || 0,
            },
            samplePacks: {
                total: packStats?.length || 0,
                active: packStats?.filter((p) => p.active)?.length || 0,
            },
            sales: {
                total: totalSales,
                totalCommissions: totalCommissions,
                averageOrderValue:
                    totalSales > 0 ? totalSales / (salesStats?.length || 1) : 0,
            },
            collaborations: {
                total: collabStats?.length || 0,
                active:
                    collabStats?.filter((c) => c.status === 'active')?.length ||
                    0,
            },
            dailyStats: dailyStats || [],
            topProducers: topProducers || [],
        };

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error in GET /api/admin/reports:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
