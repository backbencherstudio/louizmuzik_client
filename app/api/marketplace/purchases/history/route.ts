import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

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

        // Obtener parámetros de consulta
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status'); // 'completed', 'pending', 'cancelled'
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Construir query base
        let query = supabase
            .from('pack_sales')
            .select(
                `
                *,
                packs (
                    id,
                    title,
                    description,
                    cover_url,
                    demo_url,
                    genre,
                    bpm,
                    key
                ),
                profiles:producer_id (
                    username,
                    avatar_url,
                    country,
                    is_pro
                )
            `,
                { count: 'exact' }
            )
            .eq('buyer_id', user.id);

        // Aplicar filtros
        if (status) {
            query = query.eq('status', status);
        }

        if (startDate) {
            query = query.gte('created_at', startDate);
        }

        if (endDate) {
            query = query.lte('created_at', endDate);
        }

        // Aplicar ordenamiento
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Aplicar paginación
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        // Ejecutar query
        const { data: purchases, error: purchasesError, count } = await query;

        if (purchasesError) {
            return NextResponse.json(
                { error: purchasesError.message },
                { status: 400 }
            );
        }

        // Para las compras completadas, generar URLs de descarga
        const purchasesWithDownloadUrls = await Promise.all(
            purchases.map(async (purchase) => {
                if (
                    purchase.status === 'completed' &&
                    purchase.packs.pack_url
                ) {
                    const { data: signedUrl } = await supabase.storage
                        .from('packs')
                        .createSignedUrl(purchase.packs.pack_url, 3600); // URL válida por 1 hora

                    return {
                        ...purchase,
                        download_url: signedUrl,
                    };
                }
                return purchase;
            })
        );

        // Calcular estadísticas
        const stats = {
            total_spent: purchases.reduce(
                (sum, p) =>
                    p.status === 'completed' ? sum + p.total_amount : sum,
                0
            ),
            total_purchases: purchases.filter((p) => p.status === 'completed')
                .length,
            pending_purchases: purchases.filter((p) => p.status === 'pending')
                .length,
        };

        return NextResponse.json({
            purchases: purchasesWithDownloadUrls,
            stats,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
