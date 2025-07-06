import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

// Tipos
interface PackData {
    title: string;
    description: string;
    price: number;
    genre: string;
    bpm?: number;
    key?: string;
}

// Subir un nuevo pack (solo PRO)
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

        // Verificar que el usuario es PRO
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_pro')
            .eq('id', user.id)
            .single();

        if (profileError || !profile?.is_pro) {
            return NextResponse.json(
                { error: 'Only PRO users can upload packs' },
                { status: 403 }
            );
        }

        // Procesar el formulario
        const formData = await request.formData();
        const packData: PackData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string),
            genre: formData.get('genre') as string,
            bpm: parseInt(formData.get('bpm') as string) || undefined,
            key: (formData.get('key') as string) || undefined,
        };

        // Validar datos requeridos
        if (
            !packData.title ||
            !packData.description ||
            !packData.price ||
            !packData.genre
        ) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validar precio mínimo ($0.99)
        if (packData.price < 0.99) {
            return NextResponse.json(
                { error: 'Minimum price is $0.99' },
                { status: 400 }
            );
        }

        // Procesar archivos
        const coverFile = formData.get('cover') as File;
        const demoFile = formData.get('demo') as File;
        const packFile = formData.get('pack') as File;

        if (!coverFile || !demoFile || !packFile) {
            return NextResponse.json(
                { error: 'Missing required files' },
                { status: 400 }
            );
        }

        // Subir archivos
        const [coverBlob, demoBlob, packBlob] = await Promise.all([
            put(coverFile.name, coverFile, { access: 'public' }),
            put(demoFile.name, demoFile, { access: 'public' }),
            put(packFile.name, packFile, { access: 'private' }),
        ]);

        // Crear el pack en la base de datos
        const { data: pack, error: insertError } = await supabase
            .from('packs')
            .insert({
                ...packData,
                producer_id: user.id,
                cover_url: coverBlob.url,
                demo_url: demoBlob.url,
                pack_url: packBlob.url,
                status: 'active',
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json(
                { error: insertError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Pack created successfully',
            pack,
        });
    } catch (error) {
        console.error('Error creating pack:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Obtener packs (con filtros y paginación)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const genre = searchParams.get('genre');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Construir query base
        let query = supabase
            .from('packs')
            .select(
                `
                *,
                profiles:producer_id (
                    username,
                    avatar_url,
                    country,
                    is_pro
                ),
                sales_count:pack_sales(count)
            `,
                { count: 'exact' }
            )
            .eq('status', 'active');

        // Aplicar filtros
        if (genre) {
            query = query.eq('genre', genre);
        }
        if (minPrice) {
            query = query.gte('price', parseFloat(minPrice));
        }
        if (maxPrice) {
            query = query.lte('price', parseFloat(maxPrice));
        }

        // Aplicar ordenamiento
        if (sortBy === 'popularity') {
            query = query.order('sales_count', {
                ascending: sortOrder === 'asc',
            });
        } else {
            query = query.order(sortBy, { ascending: sortOrder === 'asc' });
        }

        // Aplicar paginación
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        // Ejecutar query
        const { data: packs, error, count } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            packs,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching packs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
