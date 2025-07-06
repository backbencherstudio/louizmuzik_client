import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Obtener los seguidores y seguidos del usuario actual
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'followers' o 'following'
        const producerId = searchParams.get('producerId');

        if (!type || !producerId) {
            return NextResponse.json(
                { error: 'Type and producerId are required' },
                { status: 400 }
            );
        }

        if (type !== 'followers' && type !== 'following') {
            return NextResponse.json(
                { error: 'Invalid type. Must be "followers" or "following"' },
                { status: 400 }
            );
        }

        let query = supabase.from('producer_follows').select(`
                *,
                profiles:${
                    type === 'followers' ? 'follower_id' : 'producer_id'
                } (
                    id,
                    username,
                    avatar_url,
                    country,
                    is_pro
                )
            `);

        if (type === 'followers') {
            query = query.eq('producer_id', producerId);
        } else {
            query = query.eq('follower_id', producerId);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            [type]: data.map((item) => ({
                ...item.profiles,
                followed_at: item.created_at,
            })),
        });
    } catch (error) {
        console.error('Error fetching follows:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Seguir o dejar de seguir a un productor
export async function POST(request: Request) {
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

        // Obtener el ID del productor a seguir del body
        const { producerId } = await request.json();

        if (!producerId) {
            return NextResponse.json(
                { error: 'Producer ID is required' },
                { status: 400 }
            );
        }

        // Verificar que no se esté intentando seguir a sí mismo
        if (producerId === user.id) {
            return NextResponse.json(
                { error: 'Cannot follow yourself' },
                { status: 400 }
            );
        }

        // Verificar que el productor existe
        const { data: producer, error: producerError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', producerId)
            .single();

        if (producerError || !producer) {
            return NextResponse.json(
                { error: 'Producer not found' },
                { status: 404 }
            );
        }

        // Verificar si ya sigue al productor
        const { data: existingFollow } = await supabase
            .from('producer_follows')
            .select()
            .eq('follower_id', user.id)
            .eq('producer_id', producerId)
            .single();

        if (existingFollow) {
            // Si ya lo sigue, lo deja de seguir
            const { error: deleteError } = await supabase
                .from('producer_follows')
                .delete()
                .eq('follower_id', user.id)
                .eq('producer_id', producerId);

            if (deleteError) {
                return NextResponse.json(
                    { error: deleteError.message },
                    { status: 400 }
                );
            }

            return NextResponse.json({
                message: 'Unfollowed successfully',
                action: 'unfollowed',
            });
        } else {
            // Si no lo sigue, lo empieza a seguir
            const { error: insertError } = await supabase
                .from('producer_follows')
                .insert({
                    follower_id: user.id,
                    producer_id: producerId,
                });

            if (insertError) {
                return NextResponse.json(
                    { error: insertError.message },
                    { status: 400 }
                );
            }

            return NextResponse.json({
                message: 'Followed successfully',
                action: 'followed',
            });
        }
    } catch (error) {
        console.error('Error managing follow:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Verificar si el usuario actual sigue a un productor específico
export async function HEAD(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const producerId = searchParams.get('producerId');

        if (!producerId) {
            return new Response(null, { status: 400 });
        }

        // Verificar autenticación
        const cookieStore = cookies();
        const supabaseToken = cookieStore.get('sb-token')?.value;

        if (!supabaseToken) {
            return new Response(null, { status: 401 });
        }

        // Obtener el usuario actual
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser(supabaseToken);

        if (userError || !user) {
            return new Response(null, { status: 401 });
        }

        // Verificar si sigue al productor
        const { data: follow } = await supabase
            .from('producer_follows')
            .select()
            .eq('follower_id', user.id)
            .eq('producer_id', producerId)
            .single();

        return new Response(null, {
            status: follow ? 200 : 404,
        });
    } catch (error) {
        console.error('Error checking follow status:', error);
        return new Response(null, { status: 500 });
    }
}
