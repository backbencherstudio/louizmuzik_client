import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener una categoría específica
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const { data: category, error } = await supabase
            .from('categories')
            .select(
                `
                *,
                melody_count:melodies(count),
                pack_count:sample_packs(count)
            `
            )
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json(
                { error: 'Error fetching category' },
                { status: 400 }
            );
        }

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error in GET /api/categories/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar una categoría (solo admin)
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
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
                { error: 'Unauthorized - Only admins can update categories' },
                { status: 403 }
            );
        }

        const { id } = params;

        // Verificar si la categoría existe
        const { data: existingCategory } = await supabase
            .from('categories')
            .select('id')
            .eq('id', id)
            .single();

        if (!existingCategory) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Obtener datos del body
        const body = await request.json();
        const { name, description, type, icon_url, active } = body;

        // Validar campos requeridos
        if (!name || !type) {
            return NextResponse.json(
                { error: 'Name and type are required' },
                { status: 400 }
            );
        }

        // Validar tipo
        if (!['melody', 'pack'].includes(type)) {
            return NextResponse.json(
                { error: 'Type must be either "melody" or "pack"' },
                { status: 400 }
            );
        }

        // Verificar si ya existe otra categoría con el mismo nombre y tipo
        const { data: duplicateCategory } = await supabase
            .from('categories')
            .select('id')
            .eq('name', name)
            .eq('type', type)
            .neq('id', id)
            .single();

        if (duplicateCategory) {
            return NextResponse.json(
                {
                    error: 'Another category with this name and type already exists',
                },
                { status: 400 }
            );
        }

        // Actualizar la categoría
        const { data: category, error: updateError } = await supabase
            .from('categories')
            .update({
                name,
                description,
                type,
                icon_url,
                active: active !== undefined ? active : true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json(
                { error: 'Error updating category' },
                { status: 400 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error in PATCH /api/categories/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar una categoría (solo admin)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
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
                { error: 'Unauthorized - Only admins can delete categories' },
                { status: 403 }
            );
        }

        const { id } = params;

        // Verificar si la categoría existe y obtener conteos
        const { data: category } = await supabase
            .from('categories')
            .select(
                `
                *,
                melody_count:melodies(count),
                pack_count:sample_packs(count)
            `
            )
            .eq('id', id)
            .single();

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Verificar si hay melodías o packs usando esta categoría
        if (category.melody_count > 0 || category.pack_count > 0) {
            return NextResponse.json(
                {
                    error: 'Cannot delete category with associated melodies or packs',
                },
                { status: 400 }
            );
        }

        // Eliminar la categoría
        const { error: deleteError } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return NextResponse.json(
                { error: 'Error deleting category' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Error in DELETE /api/categories/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
