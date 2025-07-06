import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Verificar autenticidad de un PDF de licencia
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const transactionId = searchParams.get('transactionId');

        if (!transactionId) {
            return NextResponse.json(
                { error: 'Missing transaction ID' },
                { status: 400 }
            );
        }

        // Buscar el acuerdo de colaboración
        const { data: agreement, error: agreementError } = await supabase
            .from('collaboration_agreements')
            .select(
                `
                *,
                melody:melodies (
                    title,
                    genre,
                    bpm,
                    key
                ),
                producer:profiles!producer_id (
                    username,
                    full_name,
                    artist_name
                ),
                collaborator:profiles!collaborator_id (
                    username,
                    full_name,
                    artist_name
                )
            `
            )
            .eq('transaction_id', transactionId)
            .single();

        if (agreementError || !agreement) {
            return NextResponse.json(
                {
                    error: 'License not found',
                    valid: false,
                },
                { status: 404 }
            );
        }

        // Verificar si la licencia está activa
        const isValid = agreement.status === 'active';

        return NextResponse.json({
            valid: isValid,
            verification_details: {
                transaction_id: agreement.transaction_id,
                download_timestamp: agreement.download_timestamp,
                melody_title: agreement.melody.title,
                producer: {
                    name: agreement.producer.full_name,
                    artist_name: agreement.producer.artist_name,
                },
                collaborator: {
                    name: agreement.collaborator.full_name,
                    artist_name: agreement.collaborator.artist_name,
                },
                split_percentage: agreement.split_percentage,
                status: agreement.status,
                pdf_url: agreement.pdf_url,
            },
        });
    } catch (error) {
        console.error('Error verifying license:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
