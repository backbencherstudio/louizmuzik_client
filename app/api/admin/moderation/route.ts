import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/email';

// GET - Obtener contenido pendiente de moderación o reportado
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

        // Verificar si el usuario es admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Only admins can access moderation' },
                { status: 403 }
            );
        }

        // Obtener parámetros de consulta
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status') || 'pending'; // pending, approved, rejected
        const type = searchParams.get('type') || 'all'; // melody, pack, all
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Construir query base para reportes
        let query = supabase.from('content_reports').select(
            `
                *,
                reporter:profiles!reporter_id (
                    username,
                    artist_name
                ),
                melody:melodies (
                    id,
                    title,
                    producer_id,
                    producer:profiles!producer_id (
                        username,
                        artist_name
                    )
                ),
                pack:sample_packs (
                    id,
                    title,
                    producer_id,
                    producer:profiles!producer_id (
                        username,
                        artist_name
                    )
                )
            `,
            { count: 'exact' }
        );

        // Aplicar filtros
        if (status !== 'all') {
            query = query.eq('status', status);
        }
        if (type !== 'all') {
            query = query.eq('content_type', type);
        }

        // Aplicar ordenamiento
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Aplicar paginación
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        // Ejecutar query
        const { data: reports, error: reportsError, count } = await query;

        if (reportsError) {
            return NextResponse.json(
                { error: 'Error fetching reports' },
                { status: 400 }
            );
        }

        // Obtener estadísticas de moderación
        const { data: stats } = await supabase
            .from('content_reports')
            .select('status', { count: 'exact' })
            .in('status', ['pending', 'approved', 'rejected'])
            .gte(
                'created_at',
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            );

        // Agrupar estadísticas por estado
        const modStats = stats?.reduce((acc: any, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, {});

        return NextResponse.json({
            reports,
            stats: {
                pending: modStats?.pending || 0,
                approved: modStats?.approved || 0,
                rejected: modStats?.rejected || 0,
            },
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error in GET /api/admin/moderation:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Crear un nuevo reporte de contenido
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
        const { content_type, content_id, reason, description } = body;

        if (!content_type || !content_id || !reason) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verificar que el contenido existe
        let contentExists = false;
        if (content_type === 'melody') {
            const { data } = await supabase
                .from('melodies')
                .select('id')
                .eq('id', content_id)
                .single();
            contentExists = !!data;
        } else if (content_type === 'pack') {
            const { data } = await supabase
                .from('sample_packs')
                .select('id')
                .eq('id', content_id)
                .single();
            contentExists = !!data;
        }

        if (!contentExists) {
            return NextResponse.json(
                { error: 'Content not found' },
                { status: 404 }
            );
        }

        // Crear el reporte
        const { data: report, error: reportError } = await supabase
            .from('content_reports')
            .insert({
                content_type,
                content_id,
                reporter_id: user.id,
                reason,
                description,
                status: 'pending',
            })
            .select()
            .single();

        if (reportError) {
            return NextResponse.json(
                { error: 'Error creating report' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Report created successfully',
            report,
        });
    } catch (error) {
        console.error('Error in POST /api/admin/moderation:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar estado de un reporte y tomar acciones de moderación
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

        // Verificar si el usuario es admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Only admins can moderate content' },
                { status: 403 }
            );
        }

        // Obtener datos del body
        const body = await request.json();
        const {
            report_id,
            action, // approve, reject
            strike, // boolean - si se debe aplicar un strike al usuario
            notes,
        } = body;

        if (!report_id || !action) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Obtener el reporte
        const { data: report } = await supabase
            .from('content_reports')
            .select(
                `
                *,
                melody:melodies (
                    id,
                    title,
                    producer_id,
                    producer:profiles!producer_id (
                        email
                    )
                ),
                pack:sample_packs (
                    id,
                    title,
                    producer_id,
                    producer:profiles!producer_id (
                        email
                    )
                )
            `
            )
            .eq('id', report_id)
            .single();

        if (!report) {
            return NextResponse.json(
                { error: 'Report not found' },
                { status: 404 }
            );
        }

        // Iniciar transacción para actualizar múltiples tablas
        const { error: updateError } = await supabase
            .from('content_reports')
            .update({
                status: action === 'approve' ? 'approved' : 'rejected',
                moderated_by: user.id,
                moderated_at: new Date().toISOString(),
                moderation_notes: notes,
            })
            .eq('id', report_id);

        if (updateError) {
            return NextResponse.json(
                { error: 'Error updating report' },
                { status: 400 }
            );
        }

        // Si se rechaza el contenido, desactivarlo
        if (action === 'reject') {
            if (report.content_type === 'melody') {
                await supabase
                    .from('melodies')
                    .update({ active: false })
                    .eq('id', report.content_id);
            } else if (report.content_type === 'pack') {
                await supabase
                    .from('sample_packs')
                    .update({ active: false })
                    .eq('id', report.content_id);
            }
        }

        // Si se solicita aplicar un strike
        if (strike) {
            const producerId =
                report.content_type === 'melody'
                    ? report.melody?.producer_id
                    : report.pack?.producer_id;

            if (producerId) {
                // Registrar el strike
                await supabase.from('user_strikes').insert({
                    user_id: producerId,
                    reason: `Content moderation - ${report.content_type} ${report.content_id}`,
                    report_id: report_id,
                    applied_by: user.id,
                });

                // Obtener total de strikes del usuario
                const { count: strikeCount } = await supabase
                    .from('user_strikes')
                    .select('*', { count: 'exact' })
                    .eq('user_id', producerId)
                    .gte(
                        'created_at',
                        new Date(
                            Date.now() - 90 * 24 * 60 * 60 * 1000
                        ).toISOString()
                    );

                // Si alcanza 3 strikes, bloquear la cuenta
                if (strikeCount && strikeCount >= 3) {
                    await supabase
                        .from('profiles')
                        .update({
                            is_blocked: true,
                            blocked_at: new Date().toISOString(),
                            blocked_by: user.id,
                            blocked_reason: 'Accumulated 3 strikes in 90 days',
                        })
                        .eq('id', producerId);

                    // Enviar email de notificación
                    const producerEmail =
                        report.content_type === 'melody'
                            ? report.melody?.producer?.email
                            : report.pack?.producer?.email;

                    if (producerEmail) {
                        await sendEmail({
                            to: producerEmail,
                            subject: 'Your account has been blocked',
                            template: 'account-blocked',
                            data: {
                                reason: 'Accumulated 3 strikes in 90 days',
                                strikeCount,
                                supportEmail: 'support@melodycollab.com',
                            },
                        });
                    }
                }
            }
        }

        return NextResponse.json({
            message: 'Moderation action completed successfully',
            status: action === 'approve' ? 'approved' : 'rejected',
        });
    } catch (error) {
        console.error('Error in PATCH /api/admin/moderation:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
