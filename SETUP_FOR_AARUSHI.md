# 🚀 SHUDDHUDARA - GitHub Upload Guide for Aarushi Chatterjee

## Your Information (Ready to Use)
- **Name**: Aarushi Chatterjee
- **Email**: aarushichatterjee27@gmail.com
- **Project**: SHUDDHUDARA Plant-Based Clean Air Solutions

---

## Step 1: Fix Git PATH Issue

Git is installed but PowerShell can't find it. Here's how to fix it:

### Option A: Restart PowerShell (Quick Fix)
1. Close all PowerShell windows
2. Open a **new** PowerShell window (Right-click Start → Windows PowerShell)
3. Test: Type `git --version` and press Enter
4. If you see a version number → Success! Continue to Step 2
5. If still error → Try Option B

### Option B: Restart Computer (Reliable Fix)
1. Save all your work
2. **Restart your computer** (this updates PATH variables)
3. After restart, open PowerShell
4. Test: `git --version`
5. Should now work! Continue to Step 2

---

## Step 2: Configure Git with Your Information

Open PowerShell and run these commands **exactly as shown**:

```powershell
git config --global user.name "Aarushi Chatterjee"
```

```powershell
git config --global user.email "aarushichatterjee27@gmail.com"
```

**Verify it worked:**
```powershell
git config --global --list
```

You should see:
```
user.name=Aarushi Chatterjee
user.email=aarushichatterjee27@gmail.com
```

---

## Step 3: Create a GitHub Account

1. Go to: **https://github.com**
2. Click **"Sign up"** (top-right corner)
3. Fill in the form:
   - **Email**: `aarushichatterjee27@gmail.com`
   - **Password**: Choose a strong password
   - **Username**: Choose your GitHub username
     - Suggestions: `aarushi-chatterjee`, `shuddhudara`, `aarushi-climate-tech`
     - This will be in your URL: `github.com/YOUR-USERNAME`
     - Choose carefully - hard to change later!
4. Complete the puzzle verification
5. Click **"Create account"**
6. **Verify your email** - Check your inbox for verification email from GitHub

---

## Step 4: Create a New Repository on GitHub

1. After logging into GitHub, click the **"+"** icon (top-right)
2. Select **"New repository"**
3. Fill in:
   - **Repository name**: `shuddhudara`
   - **Description**: "Plant-based clean air solutions platform with authentication"
   - **Visibility**: Choose **Public** (visible to everyone) or **Private** (only you can see)
   - ⚠️ **DO NOT** check "Add a README file" (we already have one!)
   - ⚠️ **DO NOT** add .gitignore or license (we have them!)
4. Click **"Create repository"**

**Keep this page open!** It will show you the commands you need.

---

## Step 5: Initialize Git Repository in Your Project

Open PowerShell and navigate to your project:

```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara
```

**Initialize Git:**
```powershell
git init
```
You should see: `Initialized empty Git repository`

**Add all files:**
```powershell
git add .
```
This stages all your files for commit.

**Create your first commit:**
```powershell
git commit -m "Initial commit: Complete SHUDDHUDARA website with authentication"
```

You should see a list of files being committed.

---

## Step 6: Connect to GitHub and Push

Go back to the GitHub page from Step 4. You'll see commands under **"…or push an existing repository from the command line"**.

**Replace YOUR-USERNAME with your actual GitHub username:**

```powershell
git remote add origin https://github.com/YOUR-USERNAME/shuddhudara.git
```

**Example:** If your username is "aarushi-chatterjee":
```powershell
git remote add origin https://github.com/aarushi-chatterjee/shuddhudara.git
```

**Rename branch to main:**
```powershell
git branch -M main
```

**Push to GitHub:**
```powershell
git push -u origin main
```

---

## Step 7: Authentication (Important!)

When you run `git push`, GitHub will ask you to authenticate. **You CANNOT use your password anymore!**

### You Need a Personal Access Token

**How to create one:**

1. In GitHub, click your profile picture (top-right) → **Settings**
2. Scroll down on left sidebar → Click **"Developer settings"**
3. Click **"Personal access tokens"** → **"Tokens (classic)"**
4. Click **"Generate new token"** → **"Generate new token (classic)"**
5. Fill in:
   - **Note**: "SHUDDHUDARA Project"
   - **Expiration**: Choose "90 days" or "No expiration"
   - **Select scopes**: Check ✅ **"repo"** (full control of private repositories)
6. Click **"Generate token"** (scroll to bottom)
7. **COPY THE TOKEN IMMEDIATELY!** (It looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`)
   - ⚠️ You won't be able to see it again!
   - Save it in a safe place (Notepad, password manager)

**When Git asks for authentication:**
- **Username**: Your GitHub username
- **Password**: **PASTE YOUR TOKEN** (not your actual password!)

---

## Step 8: Verify Upload Success

1. Go to: `https://github.com/YOUR-USERNAME/shuddhudara`
2. You should see all your project files!
   - ✅ frontend/
   - ✅ backend/
   - ✅ README.md
   - ✅ And all other files

**🎉 Congratulations! Your project is now on GitHub!**

---

## Future Updates: How to Push Changes

When you make changes to your code later, follow this workflow:

```powershell
# Navigate to project
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara

# Check what changed
git status

# Add all changes
git add .

# Commit with a message describing what you changed
git commit -m "Updated BioBloom FAQ section"

# Push to GitHub
git push
```

**Examples of good commit messages:**
- `"Added new team member photos"`
- `"Fixed login button styling"`
- `"Updated About Us section content"`
- `"Added Plantify solution page"`

---

## Troubleshooting

### "git is not recognized"
➡️ **Solution**: Restart PowerShell or restart your computer

### "fatal: not a git repository"
➡️ **Solution**: Make sure you're in the correct folder:
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara
```

### "remote origin already exists"
➡️ **Solution**: Remove and re-add:
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/shuddhudara.git
```

### "Authentication failed"
➡️ **Solution**: Make sure you're using your **Personal Access Token**, not your password!

### "Support for password authentication was removed"
➡️ **Solution**: You must use a Personal Access Token (see Step 7)

---

## Quick Command Reference

```powershell
# Configure Git (one-time setup)
git config --global user.name "Aarushi Chatterjee"
git config --global user.email "aarushichatterjee27@gmail.com"

# Initialize and first push (one-time)
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara
git init
git add .
git commit -m "Initial commit: SHUDDHUDARA website"
git remote add origin https://github.com/YOUR-USERNAME/shuddhudara.git
git branch -M main
git push -u origin main

# For future updates
git add .
git commit -m "Your message here"
git push
```

---

## Team Collaboration

Want to add your team members to the repository?

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Click **"Collaborators"** in left sidebar
4. Click **"Add people"**
5. Enter their GitHub username or email
6. They'll receive an invitation

They can then:
```powershell
git clone https://github.com/YOUR-USERNAME/shuddhudara.git
cd shuddhudara
# Make changes
git add .
git commit -m "Their changes"
git push
```

---

## Summary Checklist

- [ ] Restart PowerShell/Computer (if git not working)
- [ ] Configure Git with your name and email
- [ ] Create GitHub account at github.com
- [ ] Verify your email address
- [ ] Create new repository named "shuddhudara"
- [ ] Initialize Git in your project folder
- [ ] Add and commit all files
- [ ] Generate Personal Access Token
- [ ] Connect to GitHub remote
- [ ] Push to GitHub
- [ ] Verify files appear on GitHub website

---

## Need Help?

- **GitHub Documentation**: https://docs.github.com/en/get-started
- **Git Tutorial**: https://git-scm.com/book/en/v2
- **Project README**: Your project has a complete README.md with all details

---

**Your Project Location**: 
`C:\Users\HP\.gemini\antigravity\scratch\shuddhudara`

**After Setup, Your GitHub URL Will Be**:
`https://github.com/YOUR-USERNAME/shuddhudara`

Good luck with your upload! The project is ready and waiting! 🚀
