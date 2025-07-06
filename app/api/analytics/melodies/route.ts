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
        const sortBy = searchParams.get('sortBy') || 'plays'; // 'plays', 'downloads', 'favorites'
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

        // Obtener todas las melodías del productor
        const { data: melodies, error: melodiesError } = await supabase
            .from('melodies')
            .select('id, title, genre, created_at')
            .eq('producer_id', user.id);

        if (melodiesError) {
            return NextResponse.json(
                { error: 'Error fetching melodies' },
                { status: 400 }
            );
        }

        // Obtener estadísticas para cada melodía
        const melodiesWithStats = await Promise.all(
            melodies.map(async (melody) => {
                const [plays, downloads, favorites] = await Promise.all([
                    // Reproducciones
                    supabase
                        .from('melody_plays')
                        .select('created_at', { count: 'exact' })
                        .eq('melody_id', melody.id)
                        .gte('created_at', dateFilter.toISOString()),

                    // Descargas
                    supabase
                        .from('melody_downloads')
                        .select('created_at', { count: 'exact' })
                        .eq('melody_id', melody.id)
                        .gte('created_at', dateFilter.toISOString()),

                    // Favoritos
                    supabase
                        .from('melody_favorites')
                        .select('created_at', { count: 'exact' })
                        .eq('melody_id', melody.id)
                        .gte('created_at', dateFilter.toISOString()),
                ]);

                return {
                    ...melody,
                    stats: {
                        plays: plays.count || 0,
                        downloads: downloads.count || 0,
                        favorites: favorites.count || 0,
                    },
                };
            })
        );

        // Ordenar resultados
        melodiesWithStats.sort((a, b) => {
            const valueA = a.stats[sortBy as keyof typeof a.stats];
            const valueB = b.stats[sortBy as keyof typeof b.stats];
            return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
        });

        // Aplicar paginación
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedResults = melodiesWithStats.slice(start, end);

        // Calcular totales
        const totals = melodiesWithStats.reduce(
            (acc, melody) => ({
                total_plays: acc.total_plays + melody.stats.plays,
                total_downloads: acc.total_downloads + melody.stats.downloads,
                total_favorites: acc.total_favorites + melody.stats.favorites,
            }),
            { total_plays: 0, total_downloads: 0, total_favorites: 0 }
        );

        return NextResponse.json({
            melodies: paginatedResults,
            totals,
            pagination: {
                page,
                limit,
                total: melodiesWithStats.length,
                totalPages: Math.ceil(melodiesWithStats.length / limit),
            },
            timeRange,
            sortBy,
            sortOrder,
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching melody analytics:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
