import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';
import { sendEmail } from '@/lib/email'; // Asumimos que existe este servicio

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// POST - Manejar webhooks de Stripe
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = headers().get('stripe-signature')!;

        // Verificar la firma del webhook
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                webhookSecret
            );
        } catch (err) {
            console.error('Error verifying webhook signature:', err);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Manejar diferentes tipos de eventos
        switch (event.type) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(
                    event.data.object as Stripe.Subscription
                );
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(
                    event.data.object as Stripe.Subscription
                );
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(
                    event.data.object as Stripe.Subscription
                );
                break;

            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(
                    event.data.object as Stripe.Invoice
                );
                break;

            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(
                    event.data.object as Stripe.Invoice
                );
                break;

            case 'customer.subscription.trial_will_end':
                await handleTrialWillEnd(
                    event.data.object as Stripe.Subscription
                );
                break;
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error in POST /api/webhooks/stripe:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Manejadores de eventos
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const customer = await stripe.customers.retrieve(
        subscription.customer as string
    );

    // Buscar usuario por customer ID
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('stripe_customer_id', subscription.customer)
        .single();

    if (profile) {
        // Enviar email de bienvenida
        await sendEmail({
            to: customer.email!,
            subject: '¡Bienvenido a Melody Collab PRO!',
            template: 'subscription-welcome',
            data: {
                trialEnd: new Date(
                    subscription.trial_end! * 1000
                ).toISOString(),
            },
        });
    }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('stripe_customer_id', subscription.customer)
        .single();

    if (profile) {
        // Actualizar estado de la suscripción
        await supabase
            .from('profiles')
            .update({
                subscription_status: subscription.status,
                trial_end: subscription.trial_end
                    ? new Date(subscription.trial_end * 1000).toISOString()
                    : null,
                cancel_at: subscription.cancel_at
                    ? new Date(subscription.cancel_at * 1000).toISOString()
                    : null,
            })
            .eq('id', profile.id);

        // Enviar email según el cambio
        if (
            subscription.status === 'active' &&
            subscription.cancel_at_period_end
        ) {
            await sendEmail({
                to: profile.email,
                subject: 'Confirmación de Cancelación de Suscripción',
                template: 'subscription-cancellation',
                data: {
                    effectiveDate: new Date(
                        subscription.cancel_at! * 1000
                    ).toISOString(),
                },
            });
        }
    }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('stripe_customer_id', subscription.customer)
        .single();

    if (profile) {
        // Actualizar perfil a usuario gratuito
        await supabase
            .from('profiles')
            .update({
                role: 'free',
                subscription_status: 'canceled',
                subscription_id: null,
                trial_end: null,
                cancel_at: null,
            })
            .eq('id', profile.id);

        // Enviar email de confirmación
        await sendEmail({
            to: profile.email,
            subject: 'Tu suscripción PRO ha finalizado',
            template: 'subscription-ended',
            data: {
                cancelDate: new Date().toISOString(),
            },
        });
    }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('stripe_customer_id', invoice.customer)
        .single();

    if (profile) {
        // Enviar factura por email
        await sendEmail({
            to: profile.email,
            subject: 'Factura de Melody Collab PRO',
            template: 'invoice-paid',
            data: {
                invoiceUrl: invoice.hosted_invoice_url,
                amount: invoice.amount_paid / 100,
                date: new Date(invoice.created * 1000).toISOString(),
            },
        });
    }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('stripe_customer_id', invoice.customer)
        .single();

    if (profile) {
        // Enviar notificación de pago fallido
        await sendEmail({
            to: profile.email,
            subject: 'Problema con tu pago en Melody Collab PRO',
            template: 'payment-failed',
            data: {
                invoiceUrl: invoice.hosted_invoice_url,
                amount: invoice.amount_due / 100,
                paymentLink: invoice.payment_intent?.client_secret,
            },
        });
    }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('stripe_customer_id', subscription.customer)
        .single();

    if (profile) {
        // Enviar recordatorio de fin de prueba
        await sendEmail({
            to: profile.email,
            subject: 'Tu período de prueba PRO está por terminar',
            template: 'trial-ending',
            data: {
                trialEnd: new Date(
                    subscription.trial_end! * 1000
                ).toISOString(),
                amount: subscription.items.data[0].price?.unit_amount! / 100,
            },
        });
    }
}
