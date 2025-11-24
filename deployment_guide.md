# Deployment Guide: SHUDDHUDARA

To share your website with the world, we need to move it from your local computer to the cloud. We will use **Render** (free) for the server and **MongoDB Atlas** (free) for the database.

## Phase 1: Cloud Database (MongoDB Atlas)

Your local MongoDB won't work in the cloud. You need a cloud database.

1.  **Create Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up (free).
2.  **Create Cluster:** Create a new "Shared" (Free) cluster.
3.  **Create User:** In "Database Access", create a user (e.g., `admin`) and password. **Write this down.**
4.  **Network Access:** In "Network Access", add IP Address `0.0.0.0/0` (allows access from anywhere).
5.  **Get Connection String:**
    *   Click **Connect** -> **Drivers**.
    *   Copy the string (looks like `mongodb+srv://admin:<password>@cluster0...`).
    *   Replace `<password>` with your actual password.

## Phase 2: Code Preparation (I can help with this!)

We need to make two small changes to your code so it works online:

1.  **Serve Frontend:** Update `server.js` to serve your HTML files automatically.
2.  **Relative Paths:** Update your frontend JavaScript to talk to `/api/auth` instead of `http://localhost:3000/api/auth`.

**> Would you like me to make these code changes for you now?**

## Phase 3: Deploy to Render

Once the code is ready and pushed to GitHub:

1.  **Sign Up:** Go to [Render.com](https://render.com/) and sign up with GitHub.
2.  **New Web Service:** Click **New +** -> **Web Service**.
3.  **Connect Repo:** Select your `shuddhudara` repository.
4.  **Settings:**
    *   **Runtime:** Node
    *   **Build Command:** `npm install` (inside the backend folder, we might need a root package.json)
    *   **Start Command:** `node backend/server.js`
5.  **Environment Variables:**
    *   Add `MONGODB_URI` -> Paste your connection string from Phase 1.
    *   Add `NODE_ENV` -> `production`.
6.  **Deploy:** Click **Create Web Service**.

## Phase 4: Done!

Render will give you a URL (e.g., `https://shuddhudara.onrender.com`). You can share this link with anyone!
