# 📧 Setting Up the Email API (Resend)

To make the newsletter and contact forms fully functional with `shuddhudara@gmail.com` as the sender, you need to verify your domain or email in Resend.

## Step 1: Create/Login to Resend Account
1.  Go to [Resend.com](https://resend.com) and sign up (or log in).
2.  If you don't have a custom domain (like `shuddhudara.com`), you can test using the default `onboarding@resend.dev` (but this only sends to your own email).

## Step 2: Verify Single Sender (For Gmail)
Since you are using a Gmail address (`shuddhudara@gmail.com`), you cannot "verify the domain" in the traditional sense (DNS records) because you don't own `gmail.com`.
However, you can try to add it as a "Sender Identity" if Resend allows it (often they require a business domain).

**Recommended Workaround for Gmail:**
1.  **Use the Test Domain**: In `backend/routes/newsletterRoutes.js`, you might need to revert the `from` address to `onboarding@resend.dev` if you don't have a verified domain yet.
2.  **Verify a Custom Domain**: The best way is to buy a cheap domain (e.g., via Namecheap or GoDaddy) for `$10/year` and verify it in Resend.

## Step 3: API Key
1.  In Resend Dashboard, go to **API Keys**.
2.  Create a new API Key.
3.  Copy it.
4.  Open your `.env` file in the `backend` folder.
5.  Update the line:
    ```
    RESEND_API_KEY=re_123456789...
    ```

## Step 4: Testing
1.  Start the server: `npm start`
2.  Use the "Join the Movement" form on the homepage.
3.  Check your inbox!

**Note**: If using `from: 'shuddhudara@gmail.com'`, Resend might block it unless verified. It is safer to use `Acme <onboarding@resend.dev>` for testing until you have a real domain.
