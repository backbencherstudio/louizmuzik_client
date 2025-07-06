import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Crear un cliente de Supabase con el service_role key
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export async function POST(request: Request) {
    try {
        const { email, password, adminKey } = await request.json();

        // Verify admin setup key
        if (adminKey !== process.env.ADMIN_SETUP_KEY) {
            return NextResponse.json(
                { error: 'Invalid admin setup key' },
                { status: 401 }
            );
        }

        let userId;

        try {
            // Try to create the user
            const { data: userData, error: createError } =
                await supabaseAdmin.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true,
                });

            if (createError) {
                if (createError.message.includes('already been registered')) {
                    // If user exists, get their ID
                    const { data: existingUser, error: getUserError } =
                        await supabaseAdmin.auth.admin.getUserByEmail(email);

                    if (getUserError || !existingUser) {
                        console.error(
                            'Error getting existing user:',
                            getUserError
                        );
                        return NextResponse.json(
                            { error: 'Failed to get existing user' },
                            { status: 400 }
                        );
                    }

                    userId = existingUser.id;
                } else {
                    throw createError;
                }
            } else {
                userId = userData.user.id;
            }
        } catch (error) {
            console.error('Error in user creation:', error);
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 400 }
            );
        }

        // Update or create profile with admin role
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: userId,
                role: 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

        if (profileError) {
            console.error('Error setting admin role:', profileError);
            return NextResponse.json(
                { error: 'Failed to set admin role: ' + profileError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Admin user created/updated successfully',
            userId,
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
