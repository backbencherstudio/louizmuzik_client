import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import puppeteer from 'puppeteer';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

// POST - Descargar melodía y generar PDF de colaboración
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

        // Obtener ID de melodía del body
        const { melody_id } = await request.json();

        if (!melody_id) {
            return NextResponse.json(
                { error: 'Melody ID is required' },
                { status: 400 }
            );
        }

        // Obtener información de la melodía
        const { data: melody } = await supabase
            .from('melodies')
            .select(
                `
                *,
                producer:profiles!producer_id (
                    id,
                    full_name,
                    artist_name,
                    email
                )
            `
            )
            .eq('id', melody_id)
            .single();

        if (!melody) {
            return NextResponse.json(
                { error: 'Melody not found' },
                { status: 404 }
            );
        }

        // Obtener información del usuario que descarga
        const { data: downloader } = await supabase
            .from('profiles')
            .select('full_name, artist_name, email')
            .eq('id', user.id)
            .single();

        // Generar ID de transacción único
        const transactionId = `MC-${melody_id}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 7)}`;

        // Leer la plantilla HTML
        const templatePath = path.join(
            process.cwd(),
            'public',
            'melodycollablicense-document.html'
        );
        let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

        // Reemplazar valores en la plantilla
        const currentDate = new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        htmlTemplate = htmlTemplate
            .replace(/2025-01-22/g, currentDate)
            .replace(/Mr User/g, melody.producer.full_name)
            .replace(/Thunder Beatz/g, melody.producer.artist_name)
            .replace(/ZionBaby Emin 94bpm/g, melody.title)
            .replace(/50/g, melody.split_percentage.toString())
            .replace(/2025/g, new Date().getFullYear().toString())
            .replace(/TRANSACTION_ID/g, transactionId)
            .replace(
                /DOWNLOAD_TIMESTAMP/g,
                new Date().toLocaleString('es-MX', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short',
                })
            );

        // Generar PDF usando Puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(htmlTemplate, {
            waitUntil: 'networkidle0',
        });

        // Configurar el PDF con número de página
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            footerTemplate: `
                <div style="font-size: 10px; text-align: center; width: 100%;">
                    <span class="pageNumber"></span> de <span class="totalPages"></span>
                </div>
            `,
            margin: {
                top: '20px',
                bottom: '40px',
                left: '20px',
                right: '20px',
            },
        });

        await browser.close();

        // Subir PDF a Vercel Blob
        const { url: pdfUrl } = await put(`license-${transactionId}.pdf`, pdf, {
            access: 'public',
            addRandomSuffix: false,
            contentType: 'application/pdf',
            token: process.env.BLOB_READ_WRITE_TOKEN!,
        });

        // Registrar la descarga y el acuerdo de colaboración
        const { error: downloadError } = await supabase
            .from('melody_downloads')
            .insert({
                melody_id,
                user_id: user.id,
                transaction_id: transactionId,
                download_timestamp: new Date().toISOString(),
            });

        if (downloadError) {
            return NextResponse.json(
                { error: 'Error recording download' },
                { status: 400 }
            );
        }

        const { error: agreementError } = await supabase
            .from('collaboration_agreements')
            .insert({
                melody_id,
                producer_id: melody.producer_id,
                collaborator_id: user.id,
                transaction_id: transactionId,
                split_percentage: melody.split_percentage,
                pdf_url: pdfUrl,
                status: 'active',
            });

        if (agreementError) {
            return NextResponse.json(
                { error: 'Error recording collaboration agreement' },
                { status: 400 }
            );
        }

        // Obtener URL de descarga del archivo de audio
        const { data: audioUrl } = await supabase.storage
            .from('melodies')
            .createSignedUrl(melody.audio_url, 300); // URL válida por 5 minutos

        if (!audioUrl?.signedUrl) {
            return NextResponse.json(
                { error: 'Error generating download URL' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            transaction_id: transactionId,
            download_url: audioUrl.signedUrl,
            pdf_url: pdfUrl,
            melody: {
                title: melody.title,
                producer: melody.producer.artist_name,
                split_percentage: melody.split_percentage,
            },
        });
    } catch (error) {
        console.error('Error in POST /api/melodies/download:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - Obtener historial de descargas
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

        // Parámetros de paginación y filtrado
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;
        const role = searchParams.get('role'); // 'producer' o 'collaborator'

        // Construir query base
        let query = supabase.from('collaboration_agreements').select(
            `
                *,
                melody:melodies (
                    id,
                    title,
                    genre,
                    bpm,
                    key
                ),
                producer:profiles!producer_id (
                    id,
                    artist_name,
                    avatar_url
                ),
                collaborator:profiles!collaborator_id (
                    id,
                    artist_name,
                    avatar_url
                )
            `,
            { count: 'exact' }
        );

        // Aplicar filtro por rol
        if (role === 'producer') {
            query = query.eq('producer_id', user.id);
        } else if (role === 'collaborator') {
            query = query.eq('collaborator_id', user.id);
        } else {
            // Si no se especifica rol, mostrar ambos
            query = query.or(
                `producer_id.eq.${user.id},collaborator_id.eq.${user.id}`
            );
        }

        // Aplicar paginación y ordenamiento
        const {
            data: downloads,
            error: downloadsError,
            count,
        } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (downloadsError) {
            return NextResponse.json(
                { error: 'Error fetching downloads' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            downloads,
            pagination: {
                page,
                limit,
                total: count,
                total_pages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error in GET /api/melodies/download:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
