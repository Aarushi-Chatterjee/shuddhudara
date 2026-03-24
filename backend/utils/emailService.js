// emailService.js - Centralized email utility using Resend
// Used by: newsletterRoutes.js (welcome emails), authController.js (password reset)

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email via Resend
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - Full HTML body
 * @param {string} [options.fromName] - Sender display name (default: Shuddhudara)
 * @param {string} [options.fromEmail] - Sender email (must be a verified Resend domain)
 */
const sendEmail = async ({ to, subject, html, fromName = 'Shuddhudara', fromEmail = 'noreply@shuddhudara.in' }) => {
    // DEVELOPMENT FALLBACK: If no API Key, log to console instead of failing
    if (!process.env.RESEND_API_KEY || process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
        console.log('\n' + '='.repeat(60));
        console.log('🧪 [DEVELOPMENT EMAIL MOCK]');
        console.log(`FROM: ${fromName} <${fromEmail}>`);
        console.log(`TO: ${to}`);
        console.log(`SUBJECT: ${subject}`);
        console.log('-'.repeat(60));
        // Simple HTML to Text extraction for console readability (removes tags)
        const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log(`CONTENT: ${textContent}`);
        console.log('='.repeat(60) + '\n');
        
        return true; // Return success to keep the flow moving in dev
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to,
            subject,
            html
        });

        if (error) {
            console.error('❌ Resend API Error:', error);
            return false;
        }

        console.log(`📧 Email sent via Resend to ${to} (id: ${data?.id})`);
        return true;

    } catch (err) {
        console.error('❌ Unexpected error sending email via Resend:', err.message);
        return false;
    }
};

module.exports = { sendEmail };
