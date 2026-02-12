# AnimeRepo - GitHub & FTP Setup Guide

## Quick Start

### Prerequisites
- Git installed on your system
- GitHub account
- (Optional) FTP credentials for your hosting

---

## 1. GitHub Setup

### A. Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `AnimeRepo`
3. Description: `Advanced anime database with real-time filtering - Pure HTML5`
4. Choose: **Public** (so GitHub Pages works)
5. Click **Create repository**

### B. Connect Local Repository

```bash
# Navigate to your project
cd "C:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/AnimeRepo.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### C. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main** / root directory
4. Click **Save**

✅ Your site will be live at: `https://YOUR_USERNAME.github.io/AnimeRepo`

---

## 2. FTP Deployment

### A. Upload via FTP Client

Using FileZilla or similar:

```
Host: your-ftp-server.com
Username: your-username
Password: your-password
Remote folder: /public_html/ (or your web root)
```

**Files to upload:**
```
index.html
assets/
  ├── css/
  │   └── styles.css
  ├── js/
  │   └── app.js
  └── images/
data/
  ├── anime_database.md
  └── anime_data.json (optional, for faster loading)
```

### B. Upload via Command Line (SFTP)

```bash
sftp user@your-server.com:/public_html/
put index.html
put -r assets/
put -r data/
quit
```

### C. Upload via GitHub Actions + FTP (Automated)

Create `.github/workflows/ftp-deploy.yml`:

```yaml
name: Deploy via FTP

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: FTP Deploy
      uses: SamKirkland/FTP-Deploy-Action@v4.3.4
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./
        server-dir: ./public_html/
```

**Add GitHub Secrets:**
1. Go to Settings → Secrets and variables → Actions
2. Create:
   - `FTP_SERVER`: your-ftp-server.com
   - `FTP_USERNAME`: your-ftp-username
   - `FTP_PASSWORD`: your-ftp-password

---

## 3. Continuous Workflow

### After Every Update:

```bash
# 1. Make your changes (edit HTML, CSS, JS, or data)

# 2. Commit changes
git add -A
git commit -m "Description of changes"

# 3. Push to GitHub
git push origin main
```

**GitHub automatically:**
- Publishes to [github.io](http://) site
- Runs FTP deployment workflow (if configured)
- Updates live website

---

## 4. Data Updates

### Update Anime Data:

```bash
# 1. Replace data/anime_database.md with new data

# 2. (Optional) Convert to JSON for faster loading
python src/convert_data.py

# 3. Commit and push
git add data/anime_database.md
git commit -m "Update anime database"
git push origin main
```

---

## 5. Troubleshooting

### Site not showing on GitHub Pages?
- Check **Settings → Pages** is enabled
- Make sure `index.html` is in the root directory
- Wait 1-2 minutes after pushing

### FTP not working?
- Verify credentials are correct
- Check firewall isn't blocking FTP/SFTP
- Use passive mode if having connection issues

### Data not loading?
- Check browser console (F12) for errors
- Verify `data/anime_database.md` path is correct
- Try converting to JSON format for better compatibility

### Slow performance?
- Convert markdown to JSON: `python src/convert_data.py`
- Use JSON format in app (automatic fallback)
- Compress data if using large images

---

## 6. Useful Commands

```bash
# View commit history
git log --oneline

# See changes before commit
git diff

# Undo last commit (before push)
git reset --soft HEAD~1

# View remote info
git remote -v

# Clone in another workspace
git clone https://github.com/YOUR_USERNAME/AnimeRepo.git
```

---

## 7. Project Structure Reference

```
AnimeRepo/
├── .git/                          # Git repository
├── .github/
│   └── workflows/
│       ├── deploy.yml             # GitHub Pages auto-deploy
│       └── ftp-deploy.yml         # FTP auto-deploy (optional)
├── assets/
│   ├── css/styles.css             # Styling
│   ├── js/app.js                  # Main application
│   └── images/                    # Asset images
├── data/
│   ├── anime_database.md          # Anime data (markdown)
│   └── anime_data.json            # Anime data (JSON - optional)
├── src/
│   ├── convert_data.py            # Markdown → JSON converter
│   └── process_anime_data.py      # Original data processor
├── index.html                     # Main page
├── README.md                      # Documentation
├── SETUP.md                       # This file
└── .gitignore                     # Git ignore rules
```

---

## 8. Performance Tips

### For Faster Website:

1. **Use JSON format** (generated by `convert_data.py`)
2. **Enable browser caching** (GitHub does this automatically)
3. **Compress images** in `/assets/images`
4. **Minify CSS/JS** for production
5. **Use CDN** for GitHub Pages (automatic)

### Deploy Automation:
- GitHub Pages: Automatic on every push
- FTP: Automatic with GitHub Actions
- Update data: Just push new CSV or JSON

---

## 9. Custom Domain (Optional)

### Add Custom Domain to GitHub Pages:

1. In repository **Settings → Pages**
2. Enter your domain: `anime.yourdomain.com`
3. DNS settings: Point to GitHub IPs
4. GitHub provides CNAME setup instructions

---

## Support & Next Steps

**Ready to deploy?**
1. Create GitHub repo
2. Push with `git push origin main`
3. Enable GitHub Pages
4. Share URL!

**Questions?**
- Check GitHub docs: https://docs.github.com/
- Git docs: https://git-scm.com/doc
- Troubleshoot in terminal: `git status`

---

**🎬 Happy deploying! Your anime database is live!**
