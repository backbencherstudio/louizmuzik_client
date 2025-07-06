import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Constantes
const COMMISSION_RATE = 0.03; // 3% de comisión

// Iniciar una compra
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

        // Obtener datos de la compra
        const { packId } = await request.json();

        if (!packId) {
            return NextResponse.json(
                { error: 'Pack ID is required' },
                { status: 400 }
            );
        }

        // Obtener información del pack
        const { data: pack, error: packError } = await supabase
            .from('packs')
            .select(
                `
                *,
                profiles:producer_id (
                    username,
                    paypal_email
                )
            `
            )
            .eq('id', packId)
            .eq('status', 'active')
            .single();

        if (packError || !pack) {
            return NextResponse.json(
                { error: 'Pack not found or not available' },
                { status: 404 }
            );
        }

        // Verificar que el comprador no sea el productor
        if (pack.producer_id === user.id) {
            return NextResponse.json(
                { error: 'Cannot purchase your own pack' },
                { status: 400 }
            );
        }

        // Verificar que el productor tenga PayPal configurado
        if (!pack.profiles.paypal_email) {
            return NextResponse.json(
                { error: 'Producer has not configured PayPal' },
                { status: 400 }
            );
        }

        // Calcular comisión y monto final
        const commission = pack.price * COMMISSION_RATE;
        const producerAmount = pack.price - commission;

        // Crear la orden en la base de datos
        const { data: order, error: orderError } = await supabase
            .from('pack_sales')
            .insert({
                pack_id: packId,
                buyer_id: user.id,
                producer_id: pack.producer_id,
                total_amount: pack.price,
                commission_amount: commission,
                producer_amount: producerAmount,
                status: 'pending',
            })
            .select()
            .single();

        if (orderError) {
            return NextResponse.json(
                { error: orderError.message },
                { status: 400 }
            );
        }

        // Preparar datos para PayPal
        const paypalData = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: pack.price.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: pack.price.toFixed(2),
                            },
                        },
                    },
                    payee: {
                        email_address: pack.profiles.paypal_email,
                    },
                    payment_instruction: {
                        platform_fees: [
                            {
                                amount: {
                                    currency_code: 'USD',
                                    value: commission.toFixed(2),
                                },
                            },
                        ],
                    },
                    items: [
                        {
                            name: pack.title,
                            description: pack.description,
                            quantity: '1',
                            unit_amount: {
                                currency_code: 'USD',
                                value: pack.price.toFixed(2),
                            },
                        },
                    ],
                },
            ],
            application_context: {
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/success?orderId=${order.id}`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/cancel?orderId=${order.id}`,
            },
        };

        return NextResponse.json({
            order,
            paypalData,
            pack: {
                title: pack.title,
                price: pack.price,
                commission,
                producerAmount,
            },
        });
    } catch (error) {
        console.error('Error processing purchase:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Confirmar una compra (webhook de PayPal)
export async function PUT(request: Request) {
    try {
        const { orderId, paypalOrderId, status } = await request.json();

        if (!orderId || !paypalOrderId || !status) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Actualizar el estado de la orden
        const { data: order, error: updateError } = await supabase
            .from('pack_sales')
            .update({
                paypal_order_id: paypalOrderId,
                status: status,
                completed_at:
                    status === 'completed' ? new Date().toISOString() : null,
            })
            .eq('id', orderId)
            .select(
                `
                *,
                packs (
                    id,
                    title,
                    pack_url,
                    producer_id
                )
            `
            )
            .single();

        if (updateError) {
            return NextResponse.json(
                { error: updateError.message },
                { status: 400 }
            );
        }

        // Si la compra fue exitosa, generar URL de descarga temporal
        if (status === 'completed') {
            const { data: signedUrl } = await supabase.storage
                .from('packs')
                .createSignedUrl(order.packs.pack_url, 3600); // URL válida por 1 hora

            return NextResponse.json({
                message: 'Purchase completed successfully',
                order: {
                    ...order,
                    download_url: signedUrl,
                },
            });
        }

        return NextResponse.json({
            message: 'Order status updated',
            order,
        });
    } catch (error) {
        console.error('Error confirming purchase:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
