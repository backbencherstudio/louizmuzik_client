import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener estadísticas de licencias
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

        // Obtener parámetros de consulta
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || '30'; // días por defecto
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeRange));

        // Verificar si el usuario es admin
        const { data: userProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const isAdmin = userProfile?.role === 'admin';

        // Construir queries base
        let query = supabase
            .from('collaboration_agreements')
            .select('*', { count: 'exact' });

        // Si no es admin, filtrar por productor o colaborador
        if (!isAdmin) {
            query = query.or(
                `producer_id.eq.${user.id},collaborator_id.eq.${user.id}`
            );
        }

        // Aplicar filtro de fecha
        query = query.gte('created_at', startDate.toISOString());

        // Obtener estadísticas generales
        const { data: agreements, error: agreementsError, count } = await query;

        if (agreementsError) {
            return NextResponse.json(
                { error: 'Error fetching agreements' },
                { status: 400 }
            );
        }

        // Calcular estadísticas
        const totalActive =
            agreements?.filter((a) => a.status === 'active').length || 0;
        const totalRevoked =
            agreements?.filter((a) => a.status === 'revoked').length || 0;

        // Obtener estadísticas diarias
        const dailyStats = await supabase
            .from('collaboration_agreements')
            .select('created_at')
            .gte('created_at', startDate.toISOString())
            .order('created_at');

        // Agrupar por día
        const dailyData: { [key: string]: number } = {};
        dailyStats.data?.forEach((agreement) => {
            const date = new Date(agreement.created_at)
                .toISOString()
                .split('T')[0];
            dailyData[date] = (dailyData[date] || 0) + 1;
        });

        // Si es admin, obtener estadísticas adicionales
        let topProducers = [];
        let topCollaborators = [];

        if (isAdmin) {
            // Obtener top productores
            const { data: producers } = await supabase
                .from('collaboration_agreements')
                .select(
                    `
                    producer_id,
                    producer:profiles!producer_id (
                        username,
                        full_name,
                        artist_name
                    )
                `
                )
                .gte('created_at', startDate.toISOString());

            const producerStats = producers?.reduce((acc: any, curr) => {
                const id = curr.producer_id;
                acc[id] = acc[id] || {
                    count: 0,
                    producer: curr.producer,
                };
                acc[id].count++;
                return acc;
            }, {});

            topProducers = Object.entries(producerStats || {})
                .map(([id, data]: [string, any]) => ({
                    id,
                    count: data.count,
                    ...data.producer,
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            // Obtener top colaboradores
            const { data: collaborators } = await supabase
                .from('collaboration_agreements')
                .select(
                    `
                    collaborator_id,
                    collaborator:profiles!collaborator_id (
                        username,
                        full_name,
                        artist_name
                    )
                `
                )
                .gte('created_at', startDate.toISOString());

            const collaboratorStats = collaborators?.reduce(
                (acc: any, curr) => {
                    const id = curr.collaborator_id;
                    acc[id] = acc[id] || {
                        count: 0,
                        collaborator: curr.collaborator,
                    };
                    acc[id].count++;
                    return acc;
                },
                {}
            );

            topCollaborators = Object.entries(collaboratorStats || {})
                .map(([id, data]: [string, any]) => ({
                    id,
                    count: data.count,
                    ...data.collaborator,
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);
        }

        return NextResponse.json({
            overview: {
                total_agreements: count || 0,
                active_agreements: totalActive,
                revoked_agreements: totalRevoked,
                time_range_days: parseInt(timeRange),
            },
            daily_stats: dailyData,
            ...(isAdmin && {
                top_producers: topProducers,
                top_collaborators: topCollaborators,
            }),
        });
    } catch (error) {
        console.error('Error fetching license statistics:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
