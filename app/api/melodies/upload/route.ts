import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

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

        // Procesar el formulario
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;
        const title = formData.get('title') as string;
        const genre = formData.get('genre') as string;
        const bpm = parseInt(formData.get('bpm') as string);
        const key = formData.get('key') as string;
        const artistType = formData.get('artistType') as string;

        // Validar campos requeridos
        if (!audioFile || !title || !genre || !bpm || !key || !artistType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validar tipo de archivo
        if (!audioFile.type.startsWith('audio/')) {
            return NextResponse.json(
                { error: 'Invalid file type. Must be an audio file.' },
                { status: 400 }
            );
        }

        // Validar BPM
        if (bpm < 1 || bpm > 300) {
            return NextResponse.json(
                { error: 'BPM must be between 1 and 300' },
                { status: 400 }
            );
        }

        // Subir archivo de audio a Vercel Blob
        const blob = await put(audioFile.name, audioFile, {
            access: 'public',
        });

        // Generar waveform (simulado por ahora)
        const waveform = '▃▅▂▇▂▅▃▂'; // En una implementación real, esto se generaría analizando el audio

        // Guardar metadatos en Supabase
        const { data: melody, error: melodyError } = await supabase
            .from('melodies')
            .insert({
                title,
                producer_id: user.id,
                genre,
                bpm,
                key,
                waveform,
                audio_url: blob.url,
                artist_type,
            })
            .select()
            .single();

        if (melodyError) {
            return NextResponse.json(
                { error: melodyError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Melody uploaded successfully',
            melody,
        });
    } catch (error) {
        console.error('Melody upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
