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
    const fromEmail = 'shuddhudara@gmail.com'; // Should be your verified sender in Elastic Email

    if (!apiKey) {
        console.error('❌ FREESEND_API_KEY is missing');
        return false;
    }

    try {
        const url = 'https://api.elasticemail.com/v2/email/send';
        const params = new URLSearchParams({
            apikey: apiKey,
            from: fromEmail,
            fromName: fromName,
            to: to,
            subject: subject,
            bodyHtml: html,
            isTransactional: true
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        const data = await response.json();

        if (data.success) {
            console.log(`📧 Email sent successfully to ${to}`);
            return true;
        } else {
            console.error('❌ Freesend API Error:', data.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Error sending email via Freesend:', error.message);
        return false;
    }
};

module.exports = { sendEmail };
