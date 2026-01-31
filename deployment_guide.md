# 🚀 PurePulse Deployment & Configuration Guide

Follow these steps to set up your APIs and fix the "Server Busy" errors on Vercel.

## 1. Setting up Environment Variables on Vercel
You must add your API keys to the Vercel Dashboard for the backend to communicate with the database and email service.

### Steps:
1.  Go to your **Vercel Dashboard**.
2.  Select your project (**shuddhudara**).
3.  Click on **Settings** > **Environment Variables**.
4.  Add the following three variables:

| Variable Name | Value / Description |
| :--- | :--- |
| `DATABASE_URL` | Your Neon PostgreSQL connection string (starts with `postgres://...`) |
| `JWT_SECRET` | Create a random secure string (e.g., `shuddhudara_secure_key_2024`) |
| `FREESEND_API_KEY` | Your API Key: `317fa49e-f709-45bb-9874-42d8e1fdbe09` |

5.  Click **Save**.
6.  **IMPORTANT**: You must **Redeploy** your project for these changes to take effect.

---

## 2. Email Service (Freesend/Elastic Email)
We have switched from Resend to **Freesend**. 
*   **Key used**: `317fa49e-f709-45bb-9874-42d8e1fdbe09`
*   **Variable Name**: `FREESEND_API_KEY`
*   Note: Ensure your sender address `shuddhudara@gmail.com` is verified in your Elastic Email dashboard.

---

## 3. The PurePulse Login Fix
The error you saw earlier ("Servers are busy") was caused by the server trying to connect to a missing database or failing to initialize the tables on a cold start.

### What I Fixed for you:
*   **Resilient Initialization**: I updated `backend/server.js` with a "Singleton Promise" logic. This ensures that even if 10 users login at the exact same millisecond, the server only tries to connect to the database **once**, preventing the "Connection Pool" from crashing.
*   **Dark-Tech Aesthetic**: I've updated the background from the old green gradient to a **premium Navy & Emerald radial glow** with Glassmorphism for a "PurePulse" tech feel.
*   **Status Code Tracking**: If it fails now, it will show you the exact error code (like `500`) so we know if it's a password issue or a server configuration issue.

---

## 4. Final Verification Steps
Once you've added the variables and redeployed:
1.  Try to **Sign Up** first (this ensures the user is created in the database).
2.  If Sign Up works, **Login** will work immediately.
3.  Check the **Join Us** page; entering an email should now return a success message and send you a welcome email via Resend.

> [!TIP]
> If you still see "Server Busy", check the **Logs** tab in Vercel to see the exact red error message—it usually tells us if the database rejected the connection!
