import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Tipos de plantillas disponibles
type EmailTemplate =
    | 'subscription-welcome'
    | 'subscription-cancellation'
    | 'subscription-ended'
    | 'invoice-paid'
    | 'payment-failed'
    | 'trial-ending';

// Interfaz para los datos del email
interface EmailData {
    to: string;
    subject: string;
    template: EmailTemplate;
    data: Record<string, any>;
}

// Función para cargar y compilar plantilla
function getTemplate(templateName: EmailTemplate): HandlebarsTemplateDelegate {
    const templatePath = join(
        process.cwd(),
        'email-templates',
        `${templateName}.hbs`
    );
    const templateContent = readFileSync(templatePath, 'utf-8');
    return Handlebars.compile(templateContent);
}

// Función principal para enviar emails
export async function sendEmail({
    to,
    subject,
    template,
    data,
}: EmailData): Promise<void> {
    try {
        // Compilar la plantilla con los datos
        const compiledTemplate = getTemplate(template);
        const html = compiledTemplate(data);

        // Enviar el email
        await transporter.sendMail({
            from: `"Melody Collab" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });

        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Helpers de Handlebars personalizados
Handlebars.registerHelper('formatDate', function (date: string) {
    return new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
});

Handlebars.registerHelper('formatCurrency', function (amount: number) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
});
