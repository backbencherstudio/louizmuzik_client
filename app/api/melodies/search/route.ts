import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Obtener parámetros de búsqueda y filtrado
        const query = searchParams.get('q');
        const genre = searchParams.get('genre');
        const artistType = searchParams.get('artistType');
        const key = searchParams.get('key');
        const bpmMin = searchParams.get('bpmMin');
        const bpmMax = searchParams.get('bpmMax');
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Construir la consulta base
        let query_builder = supabase.from('melodies').select(
            `
                *,
                profiles:producer_id (
                    username,
                    avatar_url
                ),
                favorites_count:melody_favorites(count)
            `,
            { count: 'exact' }
        );

        // Aplicar filtros si existen
        if (query) {
            query_builder = query_builder.ilike('title', `%${query}%`);
        }

        if (genre) {
            query_builder = query_builder.eq('genre', genre);
        }

        if (artistType) {
            query_builder = query_builder.eq('artist_type', artistType);
        }

        if (key) {
            query_builder = query_builder.eq('key', key);
        }

        if (bpmMin) {
            query_builder = query_builder.gte('bpm', parseInt(bpmMin));
        }

        if (bpmMax) {
            query_builder = query_builder.lte('bpm', parseInt(bpmMax));
        }

        // Aplicar ordenamiento
        if (sortBy === 'popularity') {
            query_builder = query_builder.order('favorites_count', {
                ascending: sortOrder === 'asc',
            });
        } else {
            query_builder = query_builder.order(sortBy, {
                ascending: sortOrder === 'asc',
            });
        }

        // Aplicar paginación
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query_builder = query_builder.range(from, to);

        // Ejecutar la consulta
        const { data: melodies, error, count } = await query_builder;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            melodies,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error searching melodies:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
