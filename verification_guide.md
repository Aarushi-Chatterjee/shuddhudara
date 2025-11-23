# Verification Guide: SHUDDHUDARA Backend Integration

This guide will help you verify that your backend is correctly integrated with your website and that the dashboard is working as expected.

## Prerequisites

*   **VS Code** is open.
*   **MongoDB** is installed (if not, the start script will warn you).

## Step 1: Start the Application

We will use the automated script to start everything at once.

1.  Open a terminal in VS Code (Terminal -> New Terminal).
2.  Run the following command:
    ```powershell
    .\start_all.ps1
    ```
3.  **Wait** for the script to complete. It will:
    *   Start MongoDB.
    *   Start the Backend Server (in a new window).
    *   Open the Frontend in your default browser.

> **Note:** Keep the backend terminal window open. If you close it, the server stops.

## Step 2: Verify Backend Connection

1.  Check the terminal output of `start_all.ps1`. It should say:
    *   `✅ Backend is responding!`
2.  You can also manually check by visiting: [http://localhost:3000/](http://localhost:3000/)
    *   You should see a JSON response: `{"success":true,"message":"🌱 Welcome to SHUDDHUDARA API",...}`

## Step 3: Test Registration (New User)

1.  In the browser window that opened, navigate to the **Login/Register** page (usually accessible from the Home page or by going to `frontend/login/loginPage.html`).
2.  Click on **"Don't have an account? Sign Up"** (or similar link) to go to the Registration page.
3.  Fill in the form:
    *   **Name:** Test User
    *   **Email:** test@example.com (or any fake email)
    *   **Password:** password123
    *   **Confirm Password:** password123
4.  Click **Create Account**.
5.  **Expected Result:**
    *   You should see a success message.
    *   You should be automatically redirected to the **Dashboard**.

## Step 4: Verify Dashboard

1.  Once redirected to the Dashboard (`frontend/dashboard/dashboard.html`):
2.  **Check the Greeting:** Look for "Welcome, Test User!" in the top right or main area.
    *   This confirms the frontend successfully retrieved the user data from the login/registration response.
3.  **Check Protection:**
    *   Copy the URL of the dashboard.
    *   Open a **Incognito/Private** window.
    *   Paste the URL.
    *   **Expected Result:** You should be redirected back to the Login page. This confirms the `requireAuth()` protection is working.

## Step 5: Test Login (Existing User)

1.  Log out from the Dashboard (if there is a Logout button) or clear your browser data.
2.  Go back to the **Login Page**.
3.  Enter the credentials you just created:
    *   **Email:** test@example.com
    *   **Password:** password123
4.  Click **Sign In**.
5.  **Expected Result:**
    *   Success message.
    *   Redirection to the Dashboard.

## Troubleshooting

*   **"Connection error"**: Ensure the backend terminal window is still open and running.
*   **"Login failed"**: Double-check the email/password. Check the backend terminal for error logs.
*   **Nothing happens**: Open the Browser Developer Tools (F12), go to the **Console** tab, and check for red error messages.
