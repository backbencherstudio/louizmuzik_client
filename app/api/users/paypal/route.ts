import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { PayPalClient } from '@/lib/paypal';

// POST - Conectar cuenta de PayPal
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

        // Obtener datos del body
        const body = await request.json();
        const { paypal_email } = body;

        if (!paypal_email) {
            return NextResponse.json(
                { error: 'PayPal email is required' },
                { status: 400 }
            );
        }

        // Validar formato de email
        if (!paypal_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return NextResponse.json(
                { error: 'Invalid PayPal email format' },
                { status: 400 }
            );
        }

        // Verificar cuenta de PayPal
        const paypalClient = new PayPalClient();
        const isValid = await paypalClient.verifyPayPalAccount(paypal_email);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid PayPal account' },
                { status: 400 }
            );
        }

        // Actualizar perfil con email de PayPal
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                paypal_email,
                is_seller: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (updateError) {
            return NextResponse.json(
                { error: 'Error updating PayPal information' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'PayPal account connected successfully',
        });
    } catch (error) {
        console.error('Error connecting PayPal account:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - Obtener balance y transacciones de PayPal
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

        // Obtener perfil del vendedor
        const { data: profile } = await supabase
            .from('profiles')
            .select('paypal_email, is_seller')
            .eq('id', user.id)
            .single();

        if (!profile?.is_seller || !profile?.paypal_email) {
            return NextResponse.json(
                { error: 'User is not a seller or PayPal not connected' },
                { status: 400 }
            );
        }

        // Obtener balance y transacciones de PayPal
        const paypalClient = new PayPalClient();
        const balance = await paypalClient.getBalance(profile.paypal_email);
        const transactions = await paypalClient.getTransactions(
            profile.paypal_email
        );

        return NextResponse.json({
            balance,
            transactions,
        });
    } catch (error) {
        console.error('Error fetching PayPal information:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Desconectar cuenta de PayPal
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

        // Verificar si hay pagos pendientes
        const { data: pendingPayments } = await supabase
            .from('payments')
            .select('id')
            .eq('seller_id', user.id)
            .eq('status', 'pending')
            .limit(1);

        if (pendingPayments && pendingPayments.length > 0) {
            return NextResponse.json(
                {
                    error: 'Cannot disconnect PayPal account with pending payments',
                },
                { status: 400 }
            );
        }

        // Actualizar perfil
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                paypal_email: null,
                is_seller: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (updateError) {
            return NextResponse.json(
                { error: 'Error disconnecting PayPal account' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'PayPal account disconnected successfully',
        });
    } catch (error) {
        console.error('Error disconnecting PayPal account:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
