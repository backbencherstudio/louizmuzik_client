import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener lista de packs con filtros
export async function GET(request: Request) {
    try {
        // Verificar autenticación y rol de admin
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

        // Verificar que el usuario es admin
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Obtener parámetros de consulta
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const genre = searchParams.get('genre');
        const status = searchParams.get('status'); // 'active', 'inactive'
        const producerId = searchParams.get('producerId');
        const minPrice = parseFloat(searchParams.get('minPrice') || '0');
        const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Construir query base
        let query = supabase.from('packs').select(
            `
                *,
                producer:profiles (
                    username,
                    email,
                    is_pro
                ),
                stats:pack_stats (
                    views_count,
                    sales_count,
                    total_revenue,
                    total_commission
                )
            `,
            { count: 'exact' }
        );

        // Aplicar filtros
        if (search) {
            query = query.or(
                `title.ilike.%${search}%,description.ilike.%${search}%`
            );
        }
        if (genre) {
            query = query.eq('genre', genre);
        }
        if (status) {
            query = query.eq('is_active', status === 'active');
        }
        if (producerId) {
            query = query.eq('producer_id', producerId);
        }
        query = query.gte('price', minPrice).lte('price', maxPrice);

        // Aplicar ordenamiento
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Aplicar paginación
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        // Ejecutar query
        const { data: packs, error: packsError, count } = await query;

        if (packsError) {
            return NextResponse.json(
                { error: 'Error fetching packs' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            packs,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error in admin packs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar estado de pack (activar/desactivar)
export async function PATCH(request: Request) {
    try {
        // Verificar autenticación y rol de admin
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

        // Verificar que el usuario es admin
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Obtener datos del body
        const body = await request.json();
        const { packId, action } = body;

        if (!packId || !action) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Actualizar pack según la acción
        const updateData = {
            is_active: action === 'activate',
            updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
            .from('packs')
            .update(updateData)
            .eq('id', packId);

        if (updateError) {
            return NextResponse.json(
                { error: 'Error updating pack' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Pack updated successfully',
        });
    } catch (error) {
        console.error('Error in admin packs update:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar pack
export async function DELETE(request: Request) {
    try {
        // Verificar autenticación y rol de admin
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

        // Verificar que el usuario es admin
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Obtener ID del pack de la URL
        const { searchParams } = new URL(request.url);
        const packId = searchParams.get('id');

        if (!packId) {
            return NextResponse.json(
                { error: 'Missing pack ID' },
                { status: 400 }
            );
        }

        // Eliminar pack y datos relacionados
        const { error: deleteError } = await supabase
            .from('packs')
            .delete()
            .eq('id', packId);

        if (deleteError) {
            return NextResponse.json(
                { error: 'Error deleting pack' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Pack deleted successfully',
        });
    } catch (error) {
        console.error('Error in admin packs delete:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
