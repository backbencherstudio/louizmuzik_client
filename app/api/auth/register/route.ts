import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { email, password, username, full_name } = await request.json();

        // Validar los datos requeridos
        if (!email || !password || !username || !full_name) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Crear el usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp(
            {
                email,
                password,
                options: {
                    data: {
                        username,
                        full_name,
                    },
                },
            }
        );

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        // El perfil se crea automáticamente mediante un trigger en Supabase
        // que escucha los eventos auth.users

        return NextResponse.json({
            message: 'Registration successful',
            user: authData.user,
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
