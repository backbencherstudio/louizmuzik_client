import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener melodías favoritas del usuario
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

        // Parámetros de paginación
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Obtener favoritos con información de melodías
        const {
            data: favorites,
            error: favoritesError,
            count,
        } = await supabase
            .from('melody_favorites')
            .select(
                `
                melody_id,
                created_at,
                melody:melodies (
                    *,
                    producer:profiles!producer_id (
                        id,
                        artist_name,
                        avatar_url
                    )
                )
            `,
                { count: 'exact' }
            )
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (favoritesError) {
            return NextResponse.json(
                { error: 'Error fetching favorites' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            favorites: favorites.map((f) => ({
                ...f.melody,
                favorited_at: f.created_at,
            })),
            pagination: {
                page,
                limit,
                total: count,
                total_pages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error in GET /api/melodies/favorites:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Agregar melodía a favoritos
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

        // Obtener ID de melodía del body
        const { melody_id } = await request.json();

        if (!melody_id) {
            return NextResponse.json(
                { error: 'Melody ID is required' },
                { status: 400 }
            );
        }

        // Verificar si la melodía existe
        const { data: melody } = await supabase
            .from('melodies')
            .select('id')
            .eq('id', melody_id)
            .single();

        if (!melody) {
            return NextResponse.json(
                { error: 'Melody not found' },
                { status: 404 }
            );
        }

        // Agregar a favoritos
        const { error: insertError } = await supabase
            .from('melody_favorites')
            .insert({
                user_id: user.id,
                melody_id,
            });

        if (insertError) {
            // Si ya está en favoritos, no es un error
            if (insertError.code === '23505') {
                return NextResponse.json({
                    message: 'Melody already in favorites',
                });
            }

            return NextResponse.json(
                { error: 'Error adding to favorites' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Added to favorites successfully',
        });
    } catch (error) {
        console.error('Error in POST /api/melodies/favorites:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar melodía de favoritos
export async function DELETE(request: Request) {
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

        // Obtener ID de melodía de la URL
        const { searchParams } = new URL(request.url);
        const melody_id = searchParams.get('melody_id');

        if (!melody_id) {
            return NextResponse.json(
                { error: 'Melody ID is required' },
                { status: 400 }
            );
        }

        // Eliminar de favoritos
        const { error: deleteError } = await supabase
            .from('melody_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('melody_id', melody_id);

        if (deleteError) {
            return NextResponse.json(
                { error: 'Error removing from favorites' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Removed from favorites successfully',
        });
    } catch (error) {
        console.error('Error in DELETE /api/melodies/favorites:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
