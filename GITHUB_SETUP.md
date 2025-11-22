# 🚀 GitHub Setup Guide for SHUDDHUDARA

## Step 1: Install Git (if not already installed)

Download and install Git from: https://git-scm.com/downloads

After installation, verify by running:
```bash
git --version
```

## Step 2: Configure Git with Your Information

Open PowerShell or Command Prompt and run these commands:

```bash
# Set your name (this will appear in commits)
git config --global user.name "Your Full Name"

# Set your email (use the email associated with your GitHub account)
git config --global user.email "your.email@example.com"

# Verify settings
git config --global --list
```

**Example:**
```bash
git config --global user.name "Aarushi Chatterjee"
git config --global user.email "aarushi@shuddhudara.org"
```

## Step 3: Create a GitHub Account (if you don't have one)

1. Go to https://github.com
2. Click "Sign up"
3. Choose a username (e.g., "shuddhudara" or "shuddhudara-team")
4. Provide email and password
5. Verify your account

## Step 4: Create a New Repository on GitHub

1. Log into GitHub
2. Click the "+" icon in top-right corner
3. Select "New repository"
4. Fill in:
   - **Repository name**: `shuddhudara` (or `shuddhudara-website`)
   - **Description**: "Plant-based clean air solutions platform with authentication"
   - **Visibility**: Choose "Public" or "Private"
   - **DO NOT** initialize with README (we already have one)
5. Click "Create repository"

GitHub will show you a page with setup instructions. **Keep this page open!**

## Step 5: Initialize Git in Your Project

Open PowerShell and navigate to your project:

```bash
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara
```

Initialize Git repository:

```bash
# Initialize Git
git init

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit: Complete SHUDDHUDARA website with authentication"
```

## Step 6: Connect to GitHub and Push

From the GitHub page that appeared after creating the repository, copy the commands under "…or push an existing repository from the command line".

They will look like this (use YOUR repository URL):

```bash
# Add GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/shuddhudara.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/shuddhudara/shuddhudara.git
git branch -M main
git push -u origin main
```

### Authentication Options

When pushing, GitHub will ask for authentication. You have two options:

**Option A: Personal Access Token (Recommended)**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token"
3. Give it a name: "SHUDDHUDARA Project"
4. Select scopes: Check "repo" (full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. When Git asks for password, paste the token instead

**Option B: GitHub CLI**
```bash
# Install GitHub CLI from: https://cli.github.com/
gh auth login
# Follow the prompts
```

## Step 7: Verify Upload

After pushing, go to your GitHub repository page:
`https://github.com/YOUR-USERNAME/shuddhudara`

You should see all your files!

## Information You Need to Provide

To upload to GitHub, you need:

1. ✅ **GitHub Username** - Create one if you don't have it
2. ✅ **GitHub Email** - Used for Git configuration
3. ✅ **Repository Name** - Suggested: `shuddhudara`
4. ✅ **Personal Access Token** - Generate from GitHub settings (for authentication)

**No credit card or payment required for public repositories!**

## Future Workflow: Making Changes

After your initial setup, use these commands for updates:

```bash
# Check what files changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

### Example Workflow:
```bash
# You made some changes to the BioBloom page
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara
git add .
git commit -m "Updated BioBloom FAQ section with new questions"
git push
```

## Recommended Repository Settings

After uploading, configure these in your GitHub repository:

1. **Add Description**: Go to repository → About → Add description
2. **Add Topics**: Add tags like `plant-based`, `air-purification`, `climate-tech`, `nodejs`, `express`, `mongodb`
3. **Enable Issues**: Settings → Features → Check "Issues"
4. **Add Branch Protection**: Settings → Branches → Add rule for `main` (optional, for collaboration)

## .gitignore Already Configured

Your project already has a `.gitignore` file that prevents sensitive files from being uploaded:
- ✅ `node_modules/` (dependencies - will be installed via npm)
- ✅ `.env` (environment variables with secrets)
- ✅ Log files
- ✅ OS-specific files

This means your JWT secret and database credentials will NOT be uploaded to GitHub (security best practice).

## Collaborating with Your Team

To add team members:

1. Go to repository → Settings → Collaborators
2. Click "Add people"
3. Enter their GitHub username or email
4. They'll receive an invitation

Team members can then:
```bash
git clone https://github.com/YOUR-USERNAME/shuddhudara.git
cd shuddhudara
# Make changes
git add .
git commit -m "Their changes"
git push
```

## Troubleshooting

### "Git is not recognized"
- Install Git from https://git-scm.com/downloads
- Restart PowerShell after installation

### "Authentication failed"
- Use Personal Access Token instead of password
- Make sure token has "repo" scope

### "Remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/shuddhudara.git
```

### "Your branch is behind"
```bash
git pull origin main
```

---

## Quick Reference Card

```bash
# One-time setup
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git init
git remote add origin https://github.com/USERNAME/REPO.git

# Every time you make changes
git add .
git commit -m "Describe your changes"
git push

# Check status
git status
git log --oneline

# Update from GitHub
git pull
```

---

**Need Help?** Check the comprehensive README.md in your project, or reach out to your team members!
