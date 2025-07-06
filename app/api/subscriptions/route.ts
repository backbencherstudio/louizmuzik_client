import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// Constantes para la suscripción
const TRIAL_DAYS = 7;
const SUBSCRIPTION_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!;

// POST - Activar suscripción PRO (iniciar prueba gratuita)
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
        const { paymentMethodId } = await request.json();

        if (!paymentMethodId) {
            return NextResponse.json(
                { error: 'Payment method ID is required' },
                { status: 400 }
            );
        }

        // Obtener o crear el cliente de Stripe
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id, role')
            .eq('id', user.id)
            .single();

        let stripeCustomerId = profile?.stripe_customer_id;

        if (!stripeCustomerId) {
            // Crear nuevo cliente en Stripe
            const customer = await stripe.customers.create({
                email: user.email,
                payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
            stripeCustomerId = customer.id;

            // Actualizar el perfil con el ID del cliente de Stripe
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: stripeCustomerId })
                .eq('id', user.id);
        }

        // Crear la suscripción con período de prueba
        const subscription = await stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [{ price: SUBSCRIPTION_PRICE_ID }],
            trial_period_days: TRIAL_DAYS,
            payment_settings: {
                payment_method_types: ['card'],
                save_default_payment_method: 'on_subscription',
            },
            expand: ['latest_invoice.payment_intent'],
        });

        // Actualizar el rol del usuario a PRO y guardar datos de la suscripción
        await supabase
            .from('profiles')
            .update({
                role: 'pro',
                subscription_id: subscription.id,
                subscription_status: subscription.status,
                trial_end: new Date(
                    subscription.trial_end! * 1000
                ).toISOString(),
            })
            .eq('id', user.id);

        return NextResponse.json({
            subscriptionId: subscription.id,
            clientSecret: (subscription.latest_invoice as any)?.payment_intent
                ?.client_secret,
            status: subscription.status,
            trialEnd: new Date(subscription.trial_end! * 1000).toISOString(),
        });
    } catch (error) {
        console.error('Error in POST /api/subscriptions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Cancelar suscripción PRO
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

        // Obtener ID de suscripción del usuario
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_id, role')
            .eq('id', user.id)
            .single();

        if (!profile?.subscription_id || profile.role !== 'pro') {
            return NextResponse.json(
                { error: 'No active subscription found' },
                { status: 404 }
            );
        }

        // Cancelar suscripción en Stripe
        const subscription = await stripe.subscriptions.update(
            profile.subscription_id,
            {
                cancel_at_period_end: true,
            }
        );

        // Actualizar estado en la base de datos
        await supabase
            .from('profiles')
            .update({
                subscription_status: 'canceling',
                cancel_at: new Date(
                    subscription.cancel_at! * 1000
                ).toISOString(),
            })
            .eq('id', user.id);

        return NextResponse.json({
            status: 'canceling',
            effectiveDate: new Date(
                subscription.cancel_at! * 1000
            ).toISOString(),
        });
    } catch (error) {
        console.error('Error in DELETE /api/subscriptions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Renovar suscripción PRO cancelada
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

        // Obtener ID de suscripción del usuario
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_id, subscription_status')
            .eq('id', user.id)
            .single();

        if (
            !profile?.subscription_id ||
            profile.subscription_status !== 'canceling'
        ) {
            return NextResponse.json(
                { error: 'No cancelable subscription found' },
                { status: 404 }
            );
        }

        // Reactivar suscripción en Stripe
        const subscription = await stripe.subscriptions.update(
            profile.subscription_id,
            {
                cancel_at_period_end: false,
            }
        );

        // Actualizar estado en la base de datos
        await supabase
            .from('profiles')
            .update({
                subscription_status: subscription.status,
                cancel_at: null,
            })
            .eq('id', user.id);

        return NextResponse.json({
            status: subscription.status,
            subscriptionId: subscription.id,
        });
    } catch (error) {
        console.error('Error in PATCH /api/subscriptions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
