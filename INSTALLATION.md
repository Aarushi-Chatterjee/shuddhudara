# 📋 SHUDDHUDARA - Installation Checklist

## Required Software Installation

Your system needs the following software to run the full project. Here's what to install:

### 1️⃣ Node.js (Required for Backend)

**What it is**: JavaScript runtime that runs the backend server

**Download**: https://nodejs.org/
- Choose the **LTS (Long Term Support)** version
- Download the Windows Installer (.msi)
- Run the installer and follow the prompts
- ✅ Check "Automatically install necessary tools" during installation

**Verify Installation**:
```powershell
node --version
npm --version
```
You should see version numbers like `v18.x.x` and `9.x.x`

**Included**: npm (Node Package Manager) - automatically installed with Node.js

---

### 2️⃣ MongoDB (Required for Database)

**What it is**: Database that stores user accounts and authentication data

**Download**: https://www.mongodb.com/try/download/community
- Select: Windows x64
- Download the MSI installer
- Run installer, choose "Complete" installation
- ✅ Install MongoDB as a Service (check this option)
- ✅ Install MongoDB Compass (GUI tool - optional but helpful)

**Verify Installation**:
```powershell
mongod --version
```

**Start MongoDB**:
```powershell
# MongoDB should auto-start as a service
# If not, run:
net start MongoDB
```

---

### 3️⃣ Git (Required for GitHub Upload)

**What it is**: Version control system to upload and manage code on GitHub

**Download**: https://git-scm.com/downloads
- Download Git for Windows
- Run the installer
- **Important settings during installation**:
  - ✅ Use Git from the Windows Command Prompt
  - ✅ Use the OpenSSL library
  - ✅ Checkout Windows-style, commit Unix-style line endings
  - ✅ Use MinTTY (default terminal)
  - ✅ Enable Git Credential Manager

**Verify Installation**:
```powershell
git --version
```

---

## Installation Order (Recommended)

1. **Install Node.js** first (includes npm)
2. **Install MongoDB** second
3. **Install Git** third
4. **Restart your computer** (to ensure all PATH variables are updated)

---

## After Installation: Setup Your SHUDDHUDARA Project

### Step 1: Install Backend Dependencies

Open PowerShell and run:

```powershell
# Navigate to backend folder
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara\backend

# Install all packages listed in package.json
npm install
```

This will install:
- ✅ express (web framework)
- ✅ mongoose (MongoDB ODM)
- ✅ bcryptjs (password hashing)
- ✅ jsonwebtoken (JWT authentication)
- ✅ dotenv (environment variables)
- ✅ cors (cross-origin support)
- ✅ body-parser (request parsing)
- ✅ nodemon (development auto-restart)

**Expected output**: Creates a `node_modules` folder with ~200MB of packages

---

### Step 2: Configure Git

```powershell
# Set your name (shows up in commits)
git config --global user.name "Your Full Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify
git config --global --list
```

**Examples**:
```powershell
git config --global user.name "Aarushi Chatterjee"
git config --global user.email "aarushi@example.com"
```

---

### Step 3: Start MongoDB

```powershell
# Check if MongoDB is running
net start MongoDB

# If you see "The MongoDB service is starting...", it's working!
```

---

### Step 4: Test the Backend Server

```powershell
# Make sure you're in the backend folder
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara\backend

# Start the development server
npm run dev
```

**Expected output**:
```
✅ MongoDB Connected Successfully: localhost
📊 Database Name: shuddhudara
🚀 Server running on port: 3000
```

**To stop the server**: Press `Ctrl + C`

---

### Step 5: Test the Frontend

Simply open this file in your browser:
```
C:\Users\HP\.gemini\antigravity\scratch\shuddhudara\frontend\home\index.html
```

**Or** right-click the file and choose "Open with" → Your browser

---

## GitHub Information You Need

To upload your project to GitHub, you'll need:

### Required Information:

1. **Your Name** 
   - Example: "Aarushi Chatterjee"
   - Used for: Git commits
   
2. **Your Email**
   - Example: "aarushi@example.com"
   - Used for: Git configuration and GitHub account
   
3. **GitHub Username** (you'll create this)
   - Example: "shuddhudara" or "aarushi-climate-tech"
   - Choose something professional and memorable
   
4. **Repository Name**
   - Suggested: "shuddhudara" or "shuddhudara-website"
   - This will be part of your URL: github.com/username/shuddhudara

### Creating GitHub Account (Free):

1. Go to https://github.com
2. Click "Sign up"
3. Enter:
   - Username (choose carefully - hard to change later)
   - Email address
   - Password
4. Verify email
5. Choose: **Free** plan (no credit card needed!)

---

## Quick Reference: After Everything is Installed

### Starting the Backend:
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara\backend
npm run dev
```

### Opening the Frontend:
Double-click: `frontend\home\index.html`

### Uploading to GitHub (first time):
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara
git init
git add .
git commit -m "Initial commit: SHUDDHUDARA website"
git remote add origin https://github.com/YOUR-USERNAME/shuddhudara.git
git push -u origin main
```

### Making Updates Later:
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara
git add .
git commit -m "Description of changes"
git push
```

---

## Troubleshooting

### "npm is not recognized"
➡️ Node.js not installed or PATH not updated
- Install Node.js
- Restart PowerShell
- Restart computer if still not working

### "git is not recognized"
➡️ Git not installed or PATH not updated
- Install Git
- Restart PowerShell
- Restart computer if still not working

### "mongod is not recognized"
➡️ MongoDB not installed or not in PATH
- Install MongoDB
- Make sure to install as Windows Service
- Restart computer

### Backend won't start
Check:
1. ✅ Is MongoDB running? (`net start MongoDB`)
2. ✅ Did you run `npm install`?
3. ✅ Are you in the `/backend` folder?
4. ✅ Is port 3000 free? (no other server running)

### Login doesn't work
Make sure:
1. ✅ Backend server is running (`npm run dev`)
2. ✅ You created a user account (see README for API calls)
3. ✅ MongoDB is connected

---

## Next Steps

1. ✅ Download and install Node.js, MongoDB, and Git
2. ✅ Restart your computer
3. ✅ Run `npm install` in the backend folder
4. ✅ Configure Git with your name and email
5. ✅ Create a GitHub account
6. ✅ Follow GITHUB_SETUP.md to upload your project

---

## Support & Documentation

- **Main README**: `README.md` - Complete project documentation
- **GitHub Guide**: `GITHUB_SETUP.md` - Detailed GitHub upload instructions  
- **This File**: Quick installation checklist

For questions, refer to the README or check with your team members!

---

## Summary: What You Need

| Software | Purpose | Install From | Required? |
|----------|---------|--------------|-----------|
| **Node.js** | Run backend server | https://nodejs.org/ | ✅ Yes |
| **npm** | Install packages | Comes with Node.js | ✅ Yes |
| **MongoDB** | Store user data | https://www.mongodb.com/try/download/community | ✅ Yes |
| **Git** | Upload to GitHub | https://git-scm.com/downloads | ✅ Yes (for GitHub) |
| **GitHub Account** | Host code online | https://github.com | ✅ Yes (for upload) |

**Total cost**: $0 - Everything is free!

**Total disk space needed**: ~1-2 GB

**Installation time**: 20-30 minutes
