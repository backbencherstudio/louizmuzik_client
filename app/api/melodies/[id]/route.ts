import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Función auxiliar para verificar la propiedad de la melodía
async function verifyMelodyOwnership(melodyId: string, userId: string) {
    const { data: melody, error } = await supabase
        .from('melodies')
        .select('producer_id')
        .eq('id', melodyId)
        .single();

    if (error) {
        throw new Error('Error verifying melody ownership');
    }

    if (melody.producer_id !== userId) {
        throw new Error('Unauthorized: You do not own this melody');
    }

    return true;
}

// GET - Obtener detalles de una melodía específica
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Obtener detalles completos de la melodía
        const { data: melody, error } = await supabase
            .from('melodies')
            .select(
                `
                *,
                producer:profiles!producer_id (
                    id,
                    artist_name,
                    avatar_url
                ),
                favorites_count:melody_favorites(count),
                downloads_count:melody_downloads(count)
            `
            )
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json(
                { error: 'Error fetching melody' },
                { status: 400 }
            );
        }

        if (!melody) {
            return NextResponse.json(
                { error: 'Melody not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(melody);
    } catch (error) {
        console.error('Error in GET /api/melodies/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar una melodía
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

        const { id } = params;

        // Verificar si la melodía existe y el usuario es el productor
        const { data: melody } = await supabase
            .from('melodies')
            .select('producer_id')
            .eq('id', id)
            .single();

        if (!melody) {
            return NextResponse.json(
                { error: 'Melody not found' },
                { status: 404 }
            );
        }

        // Verificar si el usuario es el productor o un admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (melody.producer_id !== user.id && profile?.role !== 'admin') {
            return NextResponse.json(
                {
                    error: 'Unauthorized - Only the producer or admin can update this melody',
                },
                { status: 403 }
            );
        }

        // Obtener datos del body
        const body = await request.json();
        const {
            title,
            genre,
            bpm,
            key,
            instruments,
            split_percentage,
            active,
        } = body;

        // Validar campos requeridos
        if (
            !title ||
            !genre ||
            !bpm ||
            !key ||
            !instruments ||
            !split_percentage
        ) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Actualizar melodía
        const { data: updatedMelody, error: updateError } = await supabase
            .from('melodies')
            .update({
                title,
                genre,
                bpm,
                key,
                instruments,
                split_percentage,
                active: active !== undefined ? active : true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json(
                { error: 'Error updating melody' },
                { status: 400 }
            );
        }

        return NextResponse.json(updatedMelody);
    } catch (error) {
        console.error('Error in PATCH /api/melodies/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar una melodía
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

        const { id } = params;

        // Verificar si la melodía existe y obtener información
        const { data: melody } = await supabase
            .from('melodies')
            .select('producer_id, audio_url')
            .eq('id', id)
            .single();

        if (!melody) {
            return NextResponse.json(
                { error: 'Melody not found' },
                { status: 404 }
            );
        }

        // Verificar si el usuario es el productor o un admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (melody.producer_id !== user.id && profile?.role !== 'admin') {
            return NextResponse.json(
                {
                    error: 'Unauthorized - Only the producer or admin can delete this melody',
                },
                { status: 403 }
            );
        }

        // Verificar si hay acuerdos de colaboración activos
        const { count: activeAgreements } = await supabase
            .from('collaboration_agreements')
            .select('*', { count: 'exact' })
            .eq('melody_id', id)
            .eq('status', 'active');

        if (activeAgreements && activeAgreements > 0) {
            return NextResponse.json(
                {
                    error: 'Cannot delete melody with active collaboration agreements',
                },
                { status: 400 }
            );
        }

        // Eliminar el archivo de audio del storage
        const { error: storageError } = await supabase.storage
            .from('melodies')
            .remove([melody.audio_url]);

        if (storageError) {
            console.error('Error deleting audio file:', storageError);
        }

        // Eliminar la melodía y sus registros relacionados
        const { error: deleteError } = await supabase
            .from('melodies')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return NextResponse.json(
                { error: 'Error deleting melody' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Melody deleted successfully',
        });
    } catch (error) {
        console.error('Error in DELETE /api/melodies/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
