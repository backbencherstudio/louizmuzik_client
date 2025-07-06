import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

// GET - Obtener sample packs (con filtros)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const genre = searchParams.get('genre');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const producerId = searchParams.get('producerId');
        const orderBy = searchParams.get('orderBy') || 'created_at';
        const order = searchParams.get('order') || 'desc';

        // Construir query base
        let query = supabase.from('sample_packs').select(
            `
                *,
                producer:profiles!producer_id (
                    id,
                    username,
                    artist_name
                ),
                sales_count:sample_pack_sales(count)
            `,
            { count: 'exact' }
        );

        // Aplicar filtros
        if (genre) query = query.eq('genre', genre);
        if (minPrice) query = query.gte('price', parseFloat(minPrice));
        if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
        if (producerId) query = query.eq('producer_id', producerId);

        // Aplicar ordenamiento y paginación
        const {
            data: packs,
            count,
            error,
        } = await query
            .order(orderBy, { ascending: order === 'asc' })
            .range((page - 1) * limit, page * limit - 1);

        if (error) throw error;

        return NextResponse.json({
            packs,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error in GET /api/sample-packs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Crear nuevo sample pack (solo PRO)
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

        // Verificar si el usuario es PRO
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'pro' && profile?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Only PRO users can create sample packs' },
                { status: 403 }
            );
        }

        // Obtener datos del formulario
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const genre = formData.get('genre') as string;
        const coverFile = formData.get('cover') as File;
        const demoFile = formData.get('demo') as File;
        const packFile = formData.get('pack') as File;

        // Validaciones básicas
        if (
            !title ||
            !description ||
            !price ||
            !genre ||
            !coverFile ||
            !demoFile ||
            !packFile
        ) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (price < 0.99) {
            return NextResponse.json(
                { error: 'Price must be at least $0.99' },
                { status: 400 }
            );
        }

        // Subir archivos
        const packId = uuidv4();
        const [coverUpload, demoUpload, packUpload] = await Promise.all([
            put(`sample-packs/${packId}/cover.jpg`, coverFile, {
                access: 'public',
            }),
            put(`sample-packs/${packId}/demo.mp3`, demoFile, {
                access: 'public',
            }),
            put(`sample-packs/${packId}/pack.zip`, packFile, {
                access: 'public',
            }),
        ]);

        // Crear sample pack en la base de datos
        const { data: pack, error: insertError } = await supabase
            .from('sample_packs')
            .insert({
                id: packId,
                title,
                description,
                price,
                genre,
                producer_id: user.id,
                cover_url: coverUpload.url,
                demo_url: demoUpload.url,
                download_url: packUpload.url,
                file_size: packFile.size,
            })
            .select()
            .single();

        if (insertError) throw insertError;

        return NextResponse.json(pack);
    } catch (error) {
        console.error('Error in POST /api/sample-packs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar sample pack
export async function PATCH(request: Request) {
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

        // Obtener datos
        const { id, title, description, price, genre } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Sample pack ID is required' },
                { status: 400 }
            );
        }

        // Verificar propiedad del sample pack
        const { data: pack } = await supabase
            .from('sample_packs')
            .select('producer_id')
            .eq('id', id)
            .single();

        if (
            !pack ||
            (pack.producer_id !== user.id && profile?.role !== 'admin')
        ) {
            return NextResponse.json(
                { error: 'Sample pack not found or unauthorized' },
                { status: 404 }
            );
        }

        // Actualizar sample pack
        const { data: updatedPack, error: updateError } = await supabase
            .from('sample_packs')
            .update({
                title,
                description,
                price,
                genre,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json(updatedPack);
    } catch (error) {
        console.error('Error in PATCH /api/sample-packs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar sample pack
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

        // Obtener ID del sample pack
        const { searchParams } = new URL(request.url);
        const packId = searchParams.get('id');

        if (!packId) {
            return NextResponse.json(
                { error: 'Sample pack ID is required' },
                { status: 400 }
            );
        }

        // Verificar propiedad del sample pack
        const { data: pack } = await supabase
            .from('sample_packs')
            .select('producer_id')
            .eq('id', packId)
            .single();

        if (
            !pack ||
            (pack.producer_id !== user.id && profile?.role !== 'admin')
        ) {
            return NextResponse.json(
                { error: 'Sample pack not found or unauthorized' },
                { status: 404 }
            );
        }

        // Eliminar sample pack
        const { error: deleteError } = await supabase
            .from('sample_packs')
            .delete()
            .eq('id', packId);

        if (deleteError) throw deleteError;

        return NextResponse.json({
            success: true,
            message: 'Sample pack deleted successfully',
        });
    } catch (error) {
        console.error('Error in DELETE /api/sample-packs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
