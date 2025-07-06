import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener perfil de usuario
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

        // Obtener perfil completo
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select(
                `
                *,
                melodies (
                    id,
                    title,
                    genre,
                    bpm,
                    key,
                    active,
                    created_at
                ),
                packs (
                    id,
                    title,
                    genre,
                    price,
                    active,
                    created_at
                ),
                followers: profile_followers!follower_id (
                    count
                ),
                following: profile_followers!following_id (
                    count
                )
            `
            )
            .eq('id', user.id)
            .single();

        if (profileError) {
            return NextResponse.json(
                { error: 'Error fetching profile' },
                { status: 400 }
            );
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar perfil de usuario
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
        const {
            full_name,
            artist_name,
            bio,
            website,
            social_links,
            avatar_url,
            banner_url,
            paypal_email,
        } = body;

        // Validar campos requeridos
        if (!full_name || !artist_name) {
            return NextResponse.json(
                { error: 'Full name and artist name are required' },
                { status: 400 }
            );
        }

        // Validar formato de PayPal email si se proporciona
        if (paypal_email && !paypal_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return NextResponse.json(
                { error: 'Invalid PayPal email format' },
                { status: 400 }
            );
        }

        // Actualizar perfil
        const { data: profile, error: updateError } = await supabase
            .from('profiles')
            .update({
                full_name,
                artist_name,
                bio: bio || null,
                website: website || null,
                social_links: social_links || null,
                avatar_url: avatar_url || null,
                banner_url: banner_url || null,
                paypal_email: paypal_email || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json(
                { error: 'Error updating profile' },
                { status: 400 }
            );
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar cuenta de usuario
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

        // Verificar si el usuario tiene suscripción activa
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('stripe_subscription_id')
            .eq('user_id', user.id)
            .single();

        if (subscription?.stripe_subscription_id) {
            return NextResponse.json(
                {
                    error: 'Please cancel your subscription before deleting your account',
                },
                { status: 400 }
            );
        }

        // Eliminar perfil y datos asociados
        const { error: deleteError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', user.id);

        if (deleteError) {
            return NextResponse.json(
                { error: 'Error deleting profile' },
                { status: 400 }
            );
        }

        // Eliminar usuario de autenticación
        const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
            user.id
        );

        if (authDeleteError) {
            console.error('Error deleting auth user:', authDeleteError);
        }

        return NextResponse.json({
            message: 'Account deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
