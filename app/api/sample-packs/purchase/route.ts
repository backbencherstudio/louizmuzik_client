import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// POST - Iniciar compra de sample pack
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

        // Obtener datos de la compra
        const { packId } = await request.json();

        if (!packId) {
            return NextResponse.json(
                { error: 'Sample pack ID is required' },
                { status: 400 }
            );
        }

        // Obtener información del sample pack
        const { data: pack, error: packError } = await supabase
            .from('sample_packs')
            .select(
                `
                *,
                producer:profiles!producer_id (
                    id,
                    email,
                    stripe_account_id
                )
            `
            )
            .eq('id', packId)
            .single();

        if (packError || !pack) {
            return NextResponse.json(
                { error: 'Sample pack not found' },
                { status: 404 }
            );
        }

        // Verificar que no sea el propio productor
        if (pack.producer_id === user.id) {
            return NextResponse.json(
                { error: 'You cannot purchase your own sample pack' },
                { status: 400 }
            );
        }

        // Verificar que no haya comprado el pack anteriormente
        const { data: existingPurchase } = await supabase
            .from('sample_pack_sales')
            .select()
            .eq('pack_id', packId)
            .eq('buyer_id', user.id)
            .single();

        if (existingPurchase) {
            return NextResponse.json(
                { error: 'You already own this sample pack' },
                { status: 400 }
            );
        }

        // Calcular comisión (20% para la plataforma)
        const amount = Math.round(pack.price * 100); // Convertir a centavos
        const platformFee = Math.round(amount * 0.2);
        const producerAmount = amount - platformFee;

        // Crear sesión de Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: pack.title,
                            description: pack.description,
                            images: [pack.cover_url],
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sample-packs/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/sample-packs/${packId}`,
            metadata: {
                packId,
                buyerId: user.id,
                producerId: pack.producer_id,
                producerAmount,
                platformFee,
            },
            payment_intent_data: {
                application_fee_amount: platformFee,
                transfer_data: {
                    destination: pack.producer.stripe_account_id,
                },
            },
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error in POST /api/sample-packs/purchase:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - Verificar estado de la compra
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

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

        // Obtener sesión de Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }

        // Verificar que la sesión corresponde al usuario
        if (session.metadata?.buyerId !== user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Si el pago fue exitoso, registrar la compra
        if (
            session.payment_status === 'paid' &&
            session.status === 'complete'
        ) {
            const { data: sale, error: saleError } = await supabase
                .from('sample_pack_sales')
                .insert({
                    pack_id: session.metadata.packId,
                    buyer_id: session.metadata.buyerId,
                    producer_id: session.metadata.producerId,
                    amount: session.amount_total,
                    producer_amount: session.metadata.producerAmount,
                    platform_fee: session.metadata.platformFee,
                    stripe_session_id: session.id,
                    stripe_payment_intent_id: session.payment_intent as string,
                })
                .select()
                .single();

            if (saleError) throw saleError;

            return NextResponse.json({
                success: true,
                sale,
                downloadUrl: sale.download_url,
            });
        }

        return NextResponse.json({
            success: false,
            status: session.payment_status,
        });
    } catch (error) {
        console.error('Error in GET /api/sample-packs/purchase:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
