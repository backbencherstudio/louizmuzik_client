import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// GET - Obtener URL de descarga
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

        // Obtener ID del sample pack
        const { searchParams } = new URL(request.url);
        const packId = searchParams.get('id');

        if (!packId) {
            return NextResponse.json(
                { error: 'Sample pack ID is required' },
                { status: 400 }
            );
        }

        // Verificar que el usuario haya comprado el pack
        const { data: purchase, error: purchaseError } = await supabase
            .from('sample_pack_sales')
            .select(
                `
                *,
                pack:sample_packs (
                    title,
                    download_url,
                    producer_id
                )
            `
            )
            .eq('pack_id', packId)
            .eq('buyer_id', user.id)
            .single();

        if (purchaseError || !purchase) {
            return NextResponse.json(
                { error: 'You have not purchased this sample pack' },
                { status: 403 }
            );
        }

        // Permitir que el productor también pueda descargar
        if (
            user.id !== purchase.buyer_id &&
            user.id !== purchase.pack.producer_id
        ) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Registrar la descarga
        await supabase.from('sample_pack_downloads').insert({
            pack_id: packId,
            user_id: user.id,
            sale_id: purchase.id,
        });

        // Retornar URL de descarga
        return NextResponse.json({
            success: true,
            downloadUrl: purchase.pack.download_url,
            title: purchase.pack.title,
        });
    } catch (error) {
        console.error('Error in GET /api/sample-packs/download:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - Obtener historial de descargas
export async function HEAD(request: Request) {
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

        // Obtener parámetros de paginación
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Obtener historial de descargas
        const { data: downloads, count } = await supabase
            .from('sample_pack_downloads')
            .select(
                `
                *,
                pack:sample_packs (
                    title,
                    cover_url,
                    producer:profiles!producer_id (
                        username,
                        artist_name
                    )
                )
            `,
                { count: 'exact' }
            )
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);

        return NextResponse.json({
            downloads,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error in HEAD /api/sample-packs/download:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
