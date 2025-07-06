import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// GET - Obtener historial de facturación
export async function GET(request: Request) {
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

        // Obtener el customer ID de Stripe
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (!profile?.stripe_customer_id) {
            return NextResponse.json(
                { error: 'No billing history found' },
                { status: 404 }
            );
        }

        // Obtener facturas de Stripe
        const invoices = await stripe.invoices.list({
            customer: profile.stripe_customer_id,
            limit: 24, // Últimos 24 meses
            expand: ['data.subscription'],
        });

        // Obtener métodos de pago
        const paymentMethods = await stripe.paymentMethods.list({
            customer: profile.stripe_customer_id,
            type: 'card',
        });

        // Formatear la respuesta
        const billingHistory = invoices.data.map((invoice) => ({
            id: invoice.id,
            date: new Date(invoice.created * 1000).toISOString(),
            amount: invoice.amount_paid / 100, // Convertir de centavos a dólares
            status: invoice.status,
            pdf: invoice.invoice_pdf,
            periodStart: new Date(invoice.period_start * 1000).toISOString(),
            periodEnd: new Date(invoice.period_end * 1000).toISOString(),
            paymentMethod: {
                brand: invoice.payment_intent?.payment_method_details?.card
                    ?.brand,
                last4: invoice.payment_intent?.payment_method_details?.card
                    ?.last4,
            },
        }));

        return NextResponse.json({
            billingHistory,
            paymentMethods: paymentMethods.data.map((pm) => ({
                id: pm.id,
                brand: pm.card?.brand,
                last4: pm.card?.last4,
                expMonth: pm.card?.exp_month,
                expYear: pm.card?.exp_year,
                isDefault: pm.id === profile.stripe_customer_id,
            })),
        });
    } catch (error) {
        console.error(
            'Error in GET /api/subscriptions/billing-history:',
            error
        );
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
