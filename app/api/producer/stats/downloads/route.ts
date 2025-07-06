import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener estadísticas de descargas del productor
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
                    error: 'Unauthorized - Only PRO users can access download statistics',
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

        // 1. Resumen general de descargas
        const { data: downloadSummary } = await supabase
            .from('melody_downloads')
            .select(
                `
                id,
                created_at,
                melody:melodies!inner (
                    id,
                    title,
                    genre,
                    bpm
                ),
                collaborator:profiles!collaborator_id (
                    id,
                    username,
                    artist_name
                )
            `
            )
            .eq('producer_id', user.id)
            .gte('created_at', startDateStr)
            .order('created_at', { ascending: false });

        // 2. Descargas por melodía
        const { data: melodyStats } = await supabase
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
            .order('created_at', { ascending: false });

        // 3. Estadísticas diarias
        const { data: dailyStats } = await supabase
            .from('daily_producer_stats')
            .select('*')
            .eq('producer_id', user.id)
            .gte('date', startDateStr)
            .order('date', { ascending: false });

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
                'collaborator_id, collaborator->id, collaborator->username, collaborator->artist_name'
            )
            .order('download_count', { ascending: false })
            .limit(10);

        // Calcular totales y métricas
        const totalDownloads = downloadSummary?.length || 0;
        const uniqueCollaborators = new Set(
            downloadSummary?.map((d) => d.collaborator?.id)
        ).size;
        const activeCollaborations =
            melodyStats?.reduce(
                (sum, melody) => sum + (melody.active_collaborations || 0),
                0
            ) || 0;

        // Calcular promedios
        const dailyAverage =
            totalDownloads > 0 ? totalDownloads / parseInt(timeRange) : 0;

        // Calcular tendencias
        const downloadsByDay =
            dailyStats?.reduce((acc: any, stat) => {
                acc[stat.date] = {
                    downloads: stat.downloads_count,
                    uniqueCollaborators: stat.unique_collaborators,
                };
                return acc;
            }, {}) || {};

        // Construir respuesta
        const response = {
            summary: {
                timeRange: parseInt(timeRange),
                totalDownloads,
                uniqueCollaborators,
                activeCollaborations,
                dailyAverage,
            },
            recentDownloads: downloadSummary || [],
            melodyPerformance:
                melodyStats?.map((melody) => ({
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
            dailyStats: downloadsByDay,
            bestPerformingMelodies:
                melodyStats
                    ?.sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
                    .slice(0, 5)
                    .map((melody) => ({
                        id: melody.id,
                        title: melody.title,
                        downloads: melody.downloads,
                        activeCollaborations: melody.active_collaborations,
                    })) || [],
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in GET /api/producer/stats/downloads:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
