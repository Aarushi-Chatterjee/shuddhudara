// emailService.js - Utility to send emails via Freesend (Elastic Email)
// API documentation: https://elasticemail.com/developers/api/v2/email/send

/**
 * Send an email using Elastic Email API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 * @param {string} options.fromName - Sender name
 */
const sendEmail = async ({ to, subject, html, fromName = 'Shuddhudara' }) => {
    const apiKey = process.env.FREESEND_API_KEY;
    const fromEmail = 'shuddhudara@gmail.com';

    // Default base URL for Freesend (often self-hosted or provided by the platform)
    // If you are using a specific instance, you can add FREESEND_BASE_URL to your .env
    const baseUrl = process.env.FREESEND_BASE_URL || 'https://api.freesend.io';

    if (!apiKey) {
        console.error('❌ FREESEND_API_KEY is missing');
        return false;
    }

    try {
        const url = `${baseUrl}/api/send-email`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                fromName,
                fromEmail,
                to,
                subject,
                html
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`📧 Email sent successfully via Freesend to ${to}`);
            return true;
        } else {
            console.error('❌ Freesend API Error:', data.error || data.message || response.statusText);
            return false;
        }
    } catch (error) {
        console.error('❌ Error sending email via Freesend:', error.message);
        return false;
    }
};

module.exports = { sendEmail };
