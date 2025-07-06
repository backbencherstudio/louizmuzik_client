import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// PATCH - Revocar o cancelar una licencia
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

        // Obtener datos del body
        const body = await request.json();
        const { transactionId, reason } = body;

        if (!transactionId) {
            return NextResponse.json(
                { error: 'Missing transaction ID' },
                { status: 400 }
            );
        }

        // Verificar que el usuario sea el productor original o un admin
        const { data: agreement, error: agreementError } = await supabase
            .from('collaboration_agreements')
            .select(
                `
                *,
                melody:melodies (
                    title,
                    producer_id
                )
            `
            )
            .eq('transaction_id', transactionId)
            .single();

        if (agreementError || !agreement) {
            return NextResponse.json(
                { error: 'License not found' },
                { status: 404 }
            );
        }

        // Verificar que el usuario sea el productor original o un admin
        const { data: userProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const isAdmin = userProfile?.role === 'admin';
        const isProducer = agreement.melody.producer_id === user.id;

        if (!isAdmin && !isProducer) {
            return NextResponse.json(
                { error: 'Unauthorized to revoke this license' },
                { status: 403 }
            );
        }

        // Actualizar el estado de la licencia
        const { error: updateError } = await supabase
            .from('collaboration_agreements')
            .update({
                status: 'revoked',
                revoked_at: new Date().toISOString(),
                revoked_by: user.id,
                revocation_reason: reason || 'No reason provided',
            })
            .eq('transaction_id', transactionId);

        if (updateError) {
            return NextResponse.json(
                { error: 'Error revoking license' },
                { status: 400 }
            );
        }

        // Registrar la revocación en el historial
        const { error: historyError } = await supabase
            .from('license_revocation_history')
            .insert({
                agreement_id: agreement.id,
                revoked_by: user.id,
                reason: reason || 'No reason provided',
                melody_id: agreement.melody_id,
                producer_id: agreement.producer_id,
                collaborator_id: agreement.collaborator_id,
            });

        if (historyError) {
            console.error('Error registering revocation:', historyError);
        }

        return NextResponse.json({
            message: 'License revoked successfully',
            transaction_id: transactionId,
            revoked_at: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error revoking license:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
