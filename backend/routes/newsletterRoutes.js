const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriberModel');
const { sendEmail } = require('../utils/emailService');

// POST /api/newsletter/join
router.post('/join', async (req, res) => {
    try {
        let { name, email } = req.body;

        // 1. Trim and Validate Input
        email = email ? email.trim().toLowerCase() : null;
        name = name ? name.trim() : null;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Basic Regex for Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        }

        // 2. Check if already subscribed (Case-insensitive via lowercasing in DB if needed, but here we do it in code)
        const existing = await Subscriber.exists(email);
        if (existing) {
            const count = await Subscriber.count();
            return res.status(200).json({
                success: true,
                message: 'You are already subscribed!',
                memberCount: count // Actual count from DB
            });
        }

        // 3. Create new subscriber
        await Subscriber.create({ name, email });

        // 4. Send Welcome Email (Non-blocking)
        try {
            const isWaitlist = name === 'BioBloom Waitlist Member';
            const subject = isWaitlist ? 'Your BioBloom Waitlist Confirmation + 20% OFF! 🌸' : 'Welcome to the Movement! 🌿';

            const discountHtml = isWaitlist ? `
                <div style="background-color: #fff7ed; padding: 25px; border: 2px dashed #f97316; border-radius: 10px; margin: 30px 0; text-align: center;">
                    <p style="margin: 0; color: #9a3412; font-weight: bold; font-size: 13px; text-transform: uppercase;">Your Exclusive Discount Code</p>
                    <h2 style="margin: 10px 0; color: #ea580c; font-size: 28px; font-family: monospace;">PUREAIR20</h2>
                    <p style="margin: 0; color: #c2410c; font-size: 14px;">Enjoy 20% off your first BioBloom order.</p>
                </div>
            ` : '';

            await sendEmail({
                to: email,
                subject: subject,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 40px; border-radius: 12px;">
                        <h1 style="color: #10b981; margin-top: 0;">Welcome to Shuddhudara, ${name || 'Friend'}!</h1>
                        <p style="font-size: 16px; line-height: 1.6;">Thank you for joining the Clean Air Revolution. You've taken the first step towards a healthier, more sustainable future.</p>
                        
                        ${discountHtml}

                        <div style="background-color: #f0fdf4; padding: 25px; border-radius: 10px; margin: 30px 0;">
                            <h3 style="margin-top: 0; color: #059669; font-size: 18px;">What happens next?</h3>
                            <ul style="padding-left: 20px; font-size: 15px; color: #374151;">
                                <li style="margin-bottom: 10px;">📈 Periodic insights on air quality.</li>
                                <li style="margin-bottom: 10px;">🎁 Early access to new BioBloom updates.</li>
                                <li>🌍 Real-time impact reports from our community.</li>
                            </ul>
                        </div>

                        <p style="font-size: 16px; line-height: 1.6;">We're thrilled to have you with us in making the air pure again.</p>
                        <p style="margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                            <strong>Stay Bold,</strong><br>
                            <span style="color: #10b981; font-weight: 700;">The Shuddhudara Team</span>
                        </p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('❌ Failed to send welcome email:', emailError.message);
        }

        // 5. Final Success Response with accurate count
        const finalCount = await Subscriber.count();
        res.status(201).json({
            success: true,
            message: 'Welcome to the community!',
            memberCount: finalCount // Pure organic data count
        });

    } catch (error) {
        console.error('Newsletter Join Error Details:', {
            message: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === 'development' ? `Server error: ${error.message}` : 'Server error'
        });
    }
});

// GET /api/newsletter/count
router.get('/count', async (req, res) => {
    try {
        // Return the actual subscriber count from the database.
        const count = await Subscriber.count();

        // Prevent caching
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');


        res.json({
            success: true,
            count: count
        });
    } catch (error) {
        console.error('Newsletter Count Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
