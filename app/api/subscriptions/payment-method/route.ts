import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// POST - Agregar nuevo método de pago
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

        // Obtener datos del cuerpo de la solicitud
        const { paymentMethodId, setAsDefault = false } = await request.json();

        if (!paymentMethodId) {
            return NextResponse.json(
                { error: 'Payment method ID is required' },
                { status: 400 }
            );
        }

        // Obtener el customer ID de Stripe
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        // Adjuntar el método de pago al cliente
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: profile.stripe_customer_id,
        });

        // Si se solicita establecer como predeterminado
        if (setAsDefault) {
            await stripe.customers.update(profile.stripe_customer_id, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Payment method added successfully',
        });
    } catch (error) {
        console.error(
            'Error in POST /api/subscriptions/payment-method:',
            error
        );
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar método de pago predeterminado
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

        // Obtener datos del cuerpo de la solicitud
        const { paymentMethodId } = await request.json();

        if (!paymentMethodId) {
            return NextResponse.json(
                { error: 'Payment method ID is required' },
                { status: 400 }
            );
        }

        // Obtener el customer ID de Stripe
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        // Actualizar el método de pago predeterminado
        await stripe.customers.update(profile.stripe_customer_id, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Default payment method updated successfully',
        });
    } catch (error) {
        console.error(
            'Error in PATCH /api/subscriptions/payment-method:',
            error
        );
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar método de pago
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

        // Obtener el payment method ID de los parámetros de la URL
        const { searchParams } = new URL(request.url);
        const paymentMethodId = searchParams.get('paymentMethodId');

        if (!paymentMethodId) {
            return NextResponse.json(
                { error: 'Payment method ID is required' },
                { status: 400 }
            );
        }

        // Eliminar el método de pago
        await stripe.paymentMethods.detach(paymentMethodId);

        return NextResponse.json({
            success: true,
            message: 'Payment method removed successfully',
        });
    } catch (error) {
        console.error(
            'Error in DELETE /api/subscriptions/payment-method:',
            error
        );
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
