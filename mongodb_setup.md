# MongoDB Setup Guide

It seems **MongoDB is not installed** or not running as a service on your computer. The backend server needs MongoDB to save user data.

## Option 1: Install MongoDB (Recommended)

1.  **Download:** Go to the [MongoDB Community Download Page](https://www.mongodb.com/try/download/community).
2.  **Select Version:**
    *   Version: 7.0 (or latest)
    *   Platform: Windows
    *   Package: msi
3.  **Run the Installer:** Double-click the downloaded `.msi` file.
4.  **Installation Wizard Steps:**
    *   Click **Next**.
    *   Accept the Terms and click **Next**.
    *   Click **Complete** (NOT Custom).
    *   **CRITICAL:** Ensure **"Install MongoDB as a Service"** is CHECKED.
        *   *Service Name:* MongoDB
        *   *Data Directory:* Leave as default
        *   *Log Directory:* Leave as default
    *   Click **Next**.
    *   Uncheck "Install MongoDB Compass" (optional, but saves time).
    *   Click **Install**.
5.  **Finish:** Once done, click **Finish**.

## Option 2: Verify Installation

If you believe you already installed it, it might just be stopped or named differently.

1.  Open **Task Manager** (Ctrl+Shift+Esc).
2.  Go to the **Services** tab.
3.  Look for `MongoDB`.
4.  If found, right-click and select **Start**.

## After Installation

Once installed:
1.  Go back to VS Code.
2.  Run the start script again:
    ```powershell
    .\start_simple.ps1
    ```
3.  It should now say "MongoDB Started" or "MongoDB is running".
