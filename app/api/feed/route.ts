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

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const contentType = searchParams.get('type') || 'all'; // 'all', 'melodies', 'packs'

        // Obtener los IDs de los productores que sigue el usuario
        const { data: following, error: followingError } = await supabase
            .from('producer_follows')
            .select('producer_id')
            .eq('follower_id', user.id);

        if (followingError) {
            return NextResponse.json(
                { error: followingError.message },
                { status: 400 }
            );
        }

        const followedProducerIds = following.map((f) => f.producer_id);

        if (followedProducerIds.length === 0) {
            return NextResponse.json({
                melodies: [],
                packs: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                },
            });
        }

        // Calcular offset para paginación
        const offset = (page - 1) * limit;

        // Consultas para melodías y packs
        let melodiesPromise = Promise.resolve({ data: [], count: 0 });
        let packsPromise = Promise.resolve({ data: [], count: 0 });

        if (contentType === 'all' || contentType === 'melodies') {
            melodiesPromise = supabase
                .from('melodies')
                .select(
                    `
                    *,
                    profiles:producer_id (
                        username,
                        avatar_url,
                        country,
                        is_pro
                    ),
                    favorites_count:melody_favorites(count)
                `,
                    { count: 'exact' }
                )
                .in('producer_id', followedProducerIds)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);
        }

        if (contentType === 'all' || contentType === 'packs') {
            packsPromise = supabase
                .from('packs')
                .select(
                    `
                    *,
                    profiles:producer_id (
                        username,
                        avatar_url,
                        country,
                        is_pro
                    )
                `,
                    { count: 'exact' }
                )
                .in('producer_id', followedProducerIds)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);
        }

        // Ejecutar consultas en paralelo
        const [melodiesResult, packsResult] = await Promise.all([
            melodiesPromise,
            packsPromise,
        ]);

        // Manejar errores de las consultas
        if (melodiesResult.error) {
            return NextResponse.json(
                { error: melodiesResult.error.message },
                { status: 400 }
            );
        }

        if (packsResult.error) {
            return NextResponse.json(
                { error: packsResult.error.message },
                { status: 400 }
            );
        }

        // Calcular el total de items y páginas
        const total = (melodiesResult.count || 0) + (packsResult.count || 0);
        const totalPages = Math.ceil(total / limit);

        // Combinar y ordenar resultados por fecha
        const allContent = [
            ...(melodiesResult.data || []).map((item) => ({
                ...item,
                type: 'melody',
            })),
            ...(packsResult.data || []).map((item) => ({
                ...item,
                type: 'pack',
            })),
        ].sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        );

        return NextResponse.json({
            content: allContent.slice(0, limit),
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    } catch (error) {
        console.error('Error fetching feed:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
