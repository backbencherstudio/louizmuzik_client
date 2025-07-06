import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Cache para almacenar estadísticas (30 minutos)
const statsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos en milisegundos

// GET - Obtener estadísticas del dashboard del productor
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
                    error: 'Unauthorized - Only PRO users can access these statistics',
                },
                { status: 403 }
            );
        }

        // Verificar caché
        const cachedStats = statsCache.get(user.id);
        if (
            cachedStats &&
            Date.now() - cachedStats.timestamp < CACHE_DURATION
        ) {
            return NextResponse.json(cachedStats.data);
        }

        // Obtener parámetros de consulta para el rango de fechas
        const { searchParams } = new URL(request.url);
        const timeRange = parseInt(searchParams.get('timeRange') || '30'); // días por defecto
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);
        const startDateStr = startDate.toISOString();

        // 1. Estadísticas generales
        const { data: generalStats } = await supabase
            .from('producer_stats')
            .select('*')
            .eq('producer_id', user.id)
            .single();

        // 2. Descargas por melodía
        const { data: melodyDownloads } = await supabase
            .from('melodies')
            .select(
                `
                id,
                title,
                genre,
                bpm,
                downloads:melody_downloads(count),
                active_collaborations:collaboration_agreements!inner(count)
            `
            )
            .eq('producer_id', user.id)
            .eq('collaboration_agreements.status', 'active')
            .gte('created_at', startDateStr);

        // 3. Estadísticas diarias
        const { data: dailyStats } = await supabase
            .from('daily_producer_stats')
            .select('*')
            .eq('producer_id', user.id)
            .gte('date', startDateStr)
            .order('date', { ascending: true });

        // 4. Top colaboradores
        const { data: topCollaborators } = await supabase
            .from('melody_downloads')
            .select(
                `
                collaborator:profiles!collaborator_id (
                    id,
                    username,
                    artist_name
                ),
                download_count:count(*)
            `
            )
            .eq('producer_id', user.id)
            .gte('created_at', startDateStr)
            .not('collaborator_id', 'is', null)
            .group(
                'collaborator->id, collaborator->username, collaborator->artist_name'
            )
            .order('download_count', { ascending: false })
            .limit(5);

        // 5. Ventas de sample packs
        const { data: samplePackSales } = await supabase
            .from('sample_pack_sales')
            .select(
                `
                id,
                created_at,
                amount,
                sample_pack:sample_packs (
                    id,
                    title
                )
            `
            )
            .eq('producer_id', user.id)
            .gte('created_at', startDateStr)
            .order('created_at', { ascending: false });

        // Calcular métricas
        const totalDownloads =
            melodyDownloads?.reduce(
                (sum, melody) => sum + (melody.downloads || 0),
                0
            ) || 0;
        const totalCollaborations =
            melodyDownloads?.reduce(
                (sum, melody) => sum + (melody.active_collaborations || 0),
                0
            ) || 0;
        const totalSales =
            samplePackSales?.reduce(
                (sum, sale) => sum + (sale.amount || 0),
                0
            ) || 0;

        // Calcular tendencias diarias
        const downloadTrend =
            dailyStats?.map((day) => ({
                date: day.date,
                downloads: day.downloads_count,
                uniqueCollaborators: day.unique_collaborators,
                revenue: day.revenue,
            })) || [];

        // Preparar respuesta
        const response = {
            summary: {
                totalDownloads,
                totalCollaborations,
                totalRevenue: totalSales,
                totalMelodies: melodyDownloads?.length || 0,
                followers: generalStats?.followers_count || 0,
            },
            melodyPerformance:
                melodyDownloads?.map((melody) => ({
                    id: melody.id,
                    title: melody.title,
                    genre: melody.genre,
                    bpm: melody.bpm,
                    downloads: melody.downloads,
                    activeCollaborations: melody.active_collaborations,
                })) || [],
            topCollaborators:
                topCollaborators?.map((collab) => ({
                    id: collab.collaborator?.id,
                    username: collab.collaborator?.username,
                    artistName: collab.collaborator?.artist_name,
                    downloadCount: collab.download_count,
                })) || [],
            recentSales:
                samplePackSales?.map((sale) => ({
                    id: sale.id,
                    date: sale.created_at,
                    amount: sale.amount,
                    samplePack: sale.sample_pack,
                })) || [],
            dailyTrends: downloadTrend,
            timeRange,
        };

        // Guardar en caché
        statsCache.set(user.id, {
            data: response,
            timestamp: Date.now(),
        });

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in GET /api/producer/dashboard/stats:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
