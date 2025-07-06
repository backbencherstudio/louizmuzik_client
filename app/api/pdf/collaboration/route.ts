import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import puppeteer from 'puppeteer';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

// Función para generar un ID único de transacción
function generateTransactionId(melodyId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `MC-${melodyId}-${timestamp}-${random}`;
}

// Función para formatear la fecha y hora
function formatDateTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    };
    return new Intl.DateTimeFormat('es-MX', options).format(date);
}

// POST - Generar nuevo PDF de colaboración
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
        const { melodyId } = body;

        if (!melodyId) {
            return NextResponse.json(
                { error: 'Missing melody ID' },
                { status: 400 }
            );
        }

        // Obtener detalles de la melodía
        const { data: melody, error: melodyError } = await supabase
            .from('melodies')
            .select(
                `
                *,
                producer:profiles!producer_id (
                    username,
                    full_name,
                    email,
                    artist_name
                )
            `
            )
            .eq('id', melodyId)
            .single();

        if (melodyError || !melody) {
            return NextResponse.json(
                { error: 'Error fetching melody details' },
                { status: 400 }
            );
        }

        // Obtener perfil del usuario que descarga
        const { data: downloaderProfile, error: downloaderError } =
            await supabase
                .from('profiles')
                .select('username, full_name, email, artist_name')
                .eq('id', user.id)
                .single();

        if (downloaderError || !downloaderProfile) {
            return NextResponse.json(
                { error: 'Error fetching downloader profile' },
                { status: 400 }
            );
        }

        // Generar ID de transacción y timestamp
        const transactionId = generateTransactionId(melodyId);
        const downloadTimestamp = new Date();
        const formattedDateTime = formatDateTime(downloadTimestamp);

        // Leer la plantilla HTML
        const templatePath = path.join(
            process.cwd(),
            'public',
            'melodycollablicense-document.html'
        );
        let template = fs.readFileSync(templatePath, 'utf-8');

        // Reemplazar los valores dinámicos en la plantilla
        const replacements = {
            '2025-01-22': downloadTimestamp.toISOString().split('T')[0],
            'Mr User': melody.producer.full_name,
            'Thunder Beatz':
                melody.producer.artist_name || melody.producer.username,
            'ZionBaby Emin 94bpm': melody.title,
            '50': melody.split_percentage.toString(),
            '2025': new Date().getFullYear().toString(),
        };

        // Aplicar los reemplazos
        for (const [key, value] of Object.entries(replacements)) {
            template = template.replace(key, value);
        }

        // Agregar el sello de tiempo digital
        const timestampHtml = `
            <div style="
                position: absolute;
                bottom: 40px;
                right: 40px;
                padding: 10px;
                background: rgba(12, 207, 159, 0.1);
                border: 1px solid #0CCF9F;
                border-radius: 4px;
                font-size: 12px;
                color: #111;
                text-align: right;
            ">
                <div><strong>ID de Transacción:</strong> ${transactionId}</div>
                <div><strong>Fecha y Hora de Descarga:</strong> ${formattedDateTime}</div>
                <div style="margin-top: 4px; font-size: 10px;">Este documento fue generado digitalmente por Melody Collab</div>
            </div>
        `;

        // Insertar el sello de tiempo antes del cierre del body
        template = template.replace('</body>', `${timestampHtml}</body>`);

        // Generar PDF usando Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(template);

        // Configurar metadatos del PDF
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px',
            },
            displayHeaderFooter: true,
            footerTemplate: `
                <div style="font-size: 10px; text-align: center; width: 100%; padding: 10px;">
                    <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
                </div>
            `,
            metadata: {
                Title: `Melody Collab License - ${melody.title}`,
                Author: 'Melody Collab',
                Subject: 'Music Collaboration License Agreement',
                Keywords: 'music, collaboration, license, agreement',
                Creator: 'Melody Collab Platform',
                Producer: 'Melody Collab PDF Generator',
                CreationDate: downloadTimestamp,
                ModDate: downloadTimestamp,
                CustomMetadata: {
                    TransactionId: transactionId,
                    DownloadTimestamp: formattedDateTime,
                    MelodyId: melodyId,
                    ProducerId: melody.producer_id,
                    CollaboratorId: user.id,
                },
            },
        });
        await browser.close();

        // Subir PDF a Vercel Blob
        const filename = `license-${transactionId}.pdf`;
        const { url } = await put(filename, pdf, {
            access: 'public',
            contentType: 'application/pdf',
        });

        // Guardar registro de la colaboración con el ID de transacción
        const { error: collaborationError } = await supabase
            .from('collaboration_agreements')
            .insert({
                melody_id: melodyId,
                producer_id: melody.producer_id,
                collaborator_id: user.id,
                split_percentage: melody.split_percentage,
                pdf_url: url,
                status: 'active',
                transaction_id: transactionId,
                download_timestamp: downloadTimestamp.toISOString(),
            });

        if (collaborationError) {
            return NextResponse.json(
                { error: 'Error saving collaboration agreement' },
                { status: 400 }
            );
        }

        // Registrar la descarga
        const { error: downloadError } = await supabase
            .from('melody_downloads')
            .insert({
                melody_id: melodyId,
                user_id: user.id,
                producer_id: melody.producer_id,
                transaction_id: transactionId,
                download_timestamp: downloadTimestamp.toISOString(),
            });

        if (downloadError) {
            console.error('Error registering download:', downloadError);
        }

        return NextResponse.json({
            message: 'License agreement generated successfully',
            pdf_url: url,
            transaction_id: transactionId,
            download_timestamp: formattedDateTime,
        });
    } catch (error) {
        console.error('Error generating license PDF:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - Obtener historial de PDFs de colaboración
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

        // Obtener parámetros de consulta
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const role = searchParams.get('role') || 'all'; // 'producer', 'collaborator', 'all'

        // Construir query base
        let query = supabase.from('collaboration_agreements').select(
            `
                *,
                melody:melodies (
                    title,
                    genre,
                    bpm,
                    key
                ),
                producer:profiles!producer_id (
                    username,
                    full_name
                ),
                collaborator:profiles!collaborator_id (
                    username,
                    full_name
                )
            `,
            { count: 'exact' }
        );

        // Filtrar por rol
        if (role === 'producer') {
            query = query.eq('producer_id', user.id);
        } else if (role === 'collaborator') {
            query = query.eq('collaborator_id', user.id);
        } else {
            query = query.or(
                `producer_id.eq.${user.id},collaborator_id.eq.${user.id}`
            );
        }

        // Aplicar ordenamiento y paginación
        query = query.order('created_at', { ascending: false });
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        // Ejecutar query
        const { data: agreements, error: agreementsError, count } = await query;

        if (agreementsError) {
            return NextResponse.json(
                { error: 'Error fetching collaboration agreements' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            agreements,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching collaboration PDFs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
