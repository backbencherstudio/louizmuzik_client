import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener detalles de un pago específico
export async function GET(
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
                {
                    error: 'Unauthorized - Only admins can view payment details',
                },
                { status: 403 }
            );
        }

        const { id } = params;

        // Obtener detalles del pago
        const { data: payment, error: fetchError } = await supabase
            .from('producer_payments')
            .select(
                `
                *,
                producer:profiles!producer_id (
                    id,
                    username,
                    artist_name,
                    paypal_email
                ),
                processor:profiles!processed_by (
                    username
                ),
                sales:pack_sales (
                    id,
                    amount,
                    commission_amount,
                    created_at,
                    pack:sample_packs (
                        title
                    )
                )
            `
            )
            .eq('id', id)
            .single();

        if (fetchError) {
            return NextResponse.json(
                { error: 'Error fetching payment details' },
                { status: 400 }
            );
        }

        if (!payment) {
            return NextResponse.json(
                { error: 'Payment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(payment);
    } catch (error) {
        console.error('Error in GET /api/admin/payments/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar estado de un pago
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
                { error: 'Unauthorized - Only admins can update payments' },
                { status: 403 }
            );
        }

        const { id } = params;

        // Obtener datos del body
        const body = await request.json();
        const { status, notes, paypal_transaction_id } = body;

        // Validar estado
        if (
            !['pending', 'processing', 'completed', 'failed'].includes(status)
        ) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        // Verificar si el pago existe
        const { data: existingPayment } = await supabase
            .from('producer_payments')
            .select('status')
            .eq('id', id)
            .single();

        if (!existingPayment) {
            return NextResponse.json(
                { error: 'Payment not found' },
                { status: 404 }
            );
        }

        // Preparar datos de actualización
        const updateData: any = {
            status,
            notes,
            updated_at: new Date().toISOString(),
        };

        // Agregar campos adicionales según el estado
        if (status === 'completed') {
            if (!paypal_transaction_id) {
                return NextResponse.json(
                    {
                        error: 'PayPal transaction ID is required for completed status',
                    },
                    { status: 400 }
                );
            }
            updateData.completed_at = new Date().toISOString();
            updateData.paypal_transaction_id = paypal_transaction_id;
        } else if (status === 'failed') {
            updateData.failed_at = new Date().toISOString();
        }

        // Actualizar pago
        const { data: updatedPayment, error: updateError } = await supabase
            .from('producer_payments')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json(
                { error: 'Error updating payment' },
                { status: 400 }
            );
        }

        return NextResponse.json(updatedPayment);
    } catch (error) {
        console.error('Error in PATCH /api/admin/payments/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
