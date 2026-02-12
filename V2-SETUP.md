# Setup Guide: Custom Domain + Ads + Advanced Features

## 1. Custom Domain (anime.bluetext.in via Cloudflare)

### Step 1.1: Update GitHub Repository Settings

1. Go to: **https://github.com/mTulsiram/AnimeRepo/settings/pages**
2. Under "Custom domain" field:
   - Enter: `anime.bluetext.in`
   - Click **Save**
3. GitHub creates a `CNAME` file automatically

### Step 1.2: Configure DNS in Cloudflare

1. Go to **Cloudflare Dashboard** → **bluetext.in**
2. Click **DNS** (or **DNS Management**)
3. Add these DNS records:

```
Record 1:
Type: CNAME
Name: anime
Content: mTulsiram.github.io
TTL: Auto
Proxy Status: Proxied (orange cloud)

Record 2 (optional - for root):
Type: A
Name: @
Content: 185.199.108.153
TTL: Auto
Proxy Status: Proxied

Record 3 (optional):
Type: A
Name: @
Content: 185.199.109.153
TTL: Auto

Record 4 (optional):
Type: A
Name: @
Content: 185.199.110.153
TTL: Auto

Record 5 (optional):
Type: A
Name: @
Content: 185.199.111.153
TTL: Auto
```

### Step 1.3: Enable HTTPS

1. In **Cloudflare** → **SSL/TLS** → **Edge Certificates**
2. Enable **"Always Use HTTPS"** (toggle ON)
3. Set **Minimum TLS Version**: 1.2

### Step 1.4: Test Your Domain

- Wait 5-10 minutes for DNS propagation
- Go to: **https://anime.bluetext.in**
- Should see your anime database!

---

## 2. Google AdSense Setup

### Step 2.1: Get Google AdSense Account

1. Go to: **https://www.google.com/adsense**
2. Sign in with Google account
3. Click **Get Started**
4. Enter your website: `https://anime.bluetext.in`
5. Add your phone number
6. Follow verification steps

### Step 2.2: Wait for Approval

- Google takes 24 hours to 2 weeks to review
- You'll get email when approved

### Step 2.3: Add Ad Code to Website

Once approved, update `index-v2.html`:

Replace the ad placeholders with your AdSense code:

```html
<!-- In footer, replace [Ad Space 1] with: -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>

<!-- Email-based ad unit or responsive ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### Step 2.4: Alternative Ad Networks

If AdSense is slow, use:
- **Mediavine**: High RPM rates
- **AdThrive**: Also high RPM
- **PropellerAds**: CPM-based
- **Nitropack**: Performance + ads

---

## 3. Deploy New V2 Version

### Step 3.1: Backup Current Version

```bash
cd "C:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo"

# Create backup branch
git branch backup-v1
git push origin backup-v1
```

### Step 3.2: Prepare Data Files

```bash
# The minified JSON files should be in root or data/ folder
# Ensure these exist:
# - myanimelist-minified.json
# - anilist-minified.json
# - kitsu-minified.json
# - anidb-minified.json

# Run the data merging script
cd src
python merge_data_sources.py
cd ..
```

### Step 3.3: Replace index.html

```bash
# Keep old version as backup
rename index.html index-v1.html

# Use new version
rename index-v2.html index.html
```

### Step 3.4: Commit and Push

```bash
git add -A
git commit -m "Deploy V2: New UI, multiple data sources, advanced filtering"
git push origin main
```

GitHub Pages auto-updates. Wait 1-2 minutes.

---

## 4. Data Source Merging

### What the Merger Does:

✅ Loads 4+ anime data sources  
✅ Extracts genres (4-6 per anime)  
✅ Extracts images  
✅ Detects languages  
✅ Merges duplicate entries  
✅ Exports as single JSON file  

### Run Merge Script:

```bash
cd C:\Users\tulsiram_methre\OneDrive - S&P Global\Documents\Projects\AnimeRepo\src

python merge_data_sources.py
```

**Output:**
- `data/anime_merged.json` - 40,000+ anime with enriched metadata
- Console shows merge stats and data quality percentages

---

## 5. Ad Placement Locations

Update `index-v2.html` to add ads in these locations:

### Location 1: Header (Above Filters)
```html
<!-- After <header> opening -->
<div class="ad-top">
    <!-- Leaderboard 728x90 ad -->
</div>
```

### Location 2: Sidebar (Left Side)
```html
<!-- Between main and footer -->
<aside class="ad-sidebar">
    <!-- Skyscraper 160x600 ad -->
</aside>
```

### Location 3: Footer (Bottom)
```html
<!-- Already exists in template -->
<p id="footerAds" class="footer-ads">
    <!-- Footer ads -->
</p>
```

### Location 4: Between Results
```html
<!-- Every 10th item in list/card view -->
<!-- Add in renderList() and renderCards() -->
```

---

## 6. Sponsor Block Implementation

Add as native section in UI:

```html
<div class="sponsor-block">
    <h3>Sponsored by</h3>
    <div class="sponsor-links">
        <a href="#">Your Sponsor Here</a>
        <a href="#">Your Service Here</a>
    </div>
</div>
```

CSS:
```css
.sponsor-block {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
}
```

---

## 7. Page Support / Donate Button

Add to header:

```html
<a href="https://buymeacoffee.com/yourusername" target="_blank" class="btn-donate">
    ☕ Support This Project
</a>
```

Use services:
- **Buy Me a Coffee**: https://buymeacoffee.com
- **Patreon**: https://patreon.com
- **Ko-fi**: https://ko-fi.com
- **Direct**: PayPal/UPI donations

---

## 8. File Structure After V2 Migration

```
AnimeRepo/
├── index.html                    # ← V2 (NEW)
├── index-v1.html                 # ← Backup
├── assets/
│   ├── css/
│   │   ├── styles-v2.css        # ← V2 (NEW)
│   │   └── styles.css           # ← Old
│   ├── js/
│   │   ├── app-v2.js            # ← V2 (NEW)
│   │   └── app.js               # ← Old
│   └── images/
├── data/
│   ├── anime_merged.json        # ← V2 (NEW - from merge script)
│   ├── anime_database.md        # ← Fallback
│   ├── myanimelist-minified.json
│   ├── anilist-minified.json
│   ├── kitsu-minified.json
│   └── anidb-minified.json
├── src/
│   ├── merge_data_sources.py    # ← V2 (NEW)
│   ├── convert_data.py
│   └── process_anime_data.py
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 9. V2 Features Checklist

- ✅ Filters on top (horizontal layout)
- ✅ List and Card view toggle
- ✅ Multiple genres per anime (4-6)
- ✅ Language detection (Hindi, English, Korean, etc.)
- ✅ Anime detail pages (modal view)
- ✅ Pagination (20/50/100/200 items per page)
- ✅ Ad placeholder sections
- ✅ Sponsor blocks
- ✅ Donate button
- ✅ Search highlighting
- ✅ Real-time filtering
- ✅ Card images (when available)
- ✅ Multi-source data merging

---

## 10. Performance Optimization

### Enable Cloudflare Performance:

1. In **Cloudflare Dashboard**:
   - **Speed** → Enable **Brotli**
   - **Optimization** → **Auto Minify** (CSS, JavaScript, HTML)
   - **Caching** → **Cache Everything**
   - **Browser Cache TTL**: 1 month

2. In **GitHub Pages**:
   - Automatic caching (handled by GitHub)
   - CDN served globally

### Result:
- TTFB: <100ms
- Page Load: <2 seconds
- Fully cached: <500ms

---

## 11. Testing Checklist

After deployment, verify:

- [ ] Custom domain works: `https://anime.bluetext.in`
- [ ] HTTPS enabled (secure padlock)
- [ ] All 40K+ anime load
- [ ] Search works
- [ ] All filters functional
- [ ] List view shows anime
- [ ] Card view shows anime
- [ ] Detail modal opens
- [ ] Pagination works
- [ ] Items per page selector works
- [ ] Mobile responsive
- [ ] No console errors (F12)
- [ ] Load time < 3 seconds
- [ ] Ad spaces appear (if configured)

---

## 12. Next Steps

1. **Merge data:** `python src/merge_data_sources.py`
2. **Deploy V2:** Update index.html and push
3. **Setup custom domain:** Add DNS records in Cloudflare
4. **Apply for AdSense:** Submit to Google
5. **Add ads:** Once approved, insert ad codes
6. **Test everything:** Verify all features work
7. **Share:** Post on social media

---

## 📊 Expected Results After V2

| Metric | Before | After |
|--------|--------|-------|
| Anime Count | 39,313 | 40,000+ |
| Genres per anime | 2 | 4-6 |
| Load Time | 3-5s | 1-2s |
| Data Quality | 60% | 85%+ |
| Images Available | 10% | 40%+ |
| Language Detection | Limited | Hindi, English, Korean, etc. |

---

## 🎯 Success Criteria

Your anime database is production-ready when:
- ✅ Custom domain: anime.bluetext.in works
- ✅ HTTPS is enabled
- ✅ All features load without errors
- ✅ Mobile version responsive
- ✅ Ad networks configured
- ✅ Performance score 80+
- ✅ Data quality improved to 85%+

---

**Ready to launch? Start with Step 3.2 (Merge Data) and follow through!** 🚀
