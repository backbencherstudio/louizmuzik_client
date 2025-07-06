import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener y filtrar melodías
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parámetros de paginación
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Parámetros de filtrado
        const search = searchParams.get('search');
        const genre = searchParams.get('genre');
        const bpm = searchParams.get('bpm');
        const key = searchParams.get('key');
        const instrument = searchParams.get('instrument');
        const producerId = searchParams.get('producer_id');
        const sortBy = searchParams.get('sort_by') || 'created_at';
        const sortOrder = searchParams.get('sort_order') || 'desc';

        // Construir query base
        let query = supabase.from('melodies').select(
            `
                *,
                producer:profiles!producer_id (
                    id,
                    artist_name,
                    avatar_url
                ),
                favorites_count:melody_favorites(count),
                downloads_count:melody_downloads(count)
            `,
            { count: 'exact' }
        );

        // Aplicar filtros
        if (search) {
            query = query.ilike('title', `%${search}%`);
        }
        if (genre) {
            query = query.eq('genre', genre);
        }
        if (bpm) {
            query = query.eq('bpm', bpm);
        }
        if (key) {
            query = query.eq('key', key);
        }
        if (instrument) {
            query = query.contains('instruments', [instrument]);
        }
        if (producerId) {
            query = query.eq('producer_id', producerId);
        }

        // Aplicar ordenamiento
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Aplicar paginación
        const {
            data: melodies,
            error,
            count,
        } = await query.range(offset, offset + limit - 1);

        if (error) {
            return NextResponse.json(
                { error: 'Error fetching melodies' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            melodies,
            pagination: {
                page,
                limit,
                total: count,
                total_pages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error in GET /api/melodies:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Subir nueva melodía
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

        // Verificar límite de subidas para usuarios gratuitos
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_pro')
            .eq('id', user.id)
            .single();

        if (!profile?.is_pro) {
            const { count } = await supabase
                .from('melodies')
                .select('*', { count: 'exact' })
                .eq('producer_id', user.id)
                .gte(
                    'created_at',
                    new Date(new Date().setDate(1)).toISOString()
                );

            if (count && count >= 3) {
                return NextResponse.json(
                    {
                        error: 'Free users can only upload 3 melodies per month',
                    },
                    { status: 400 }
                );
            }
        }

        // Obtener datos del body
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const genre = formData.get('genre') as string;
        const bpm = parseInt(formData.get('bpm') as string);
        const key = formData.get('key') as string;
        const instruments = JSON.parse(formData.get('instruments') as string);
        const audioFile = formData.get('audio') as File;
        const split = parseInt(formData.get('split') as string) || 50;

        // Validar campos requeridos
        if (!title || !genre || !bpm || !key || !instruments || !audioFile) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validar formato de audio
        if (!audioFile.type.startsWith('audio/')) {
            return NextResponse.json(
                { error: 'Invalid file format' },
                { status: 400 }
            );
        }

        // Subir archivo de audio
        const audioBuffer = await audioFile.arrayBuffer();
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('melodies')
            .upload(`${user.id}/${Date.now()}-${audioFile.name}`, audioBuffer, {
                contentType: audioFile.type,
                cacheControl: '3600',
            });

        if (uploadError) {
            return NextResponse.json(
                { error: 'Error uploading audio file' },
                { status: 400 }
            );
        }

        // Crear registro de melodía
        const { data: melody, error: insertError } = await supabase
            .from('melodies')
            .insert({
                title,
                genre,
                bpm,
                key,
                instruments,
                audio_url: uploadData.path,
                producer_id: user.id,
                split_percentage: split,
                active: true,
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json(
                { error: 'Error creating melody' },
                { status: 400 }
            );
        }

        return NextResponse.json(melody);
    } catch (error) {
        console.error('Error in POST /api/melodies:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
