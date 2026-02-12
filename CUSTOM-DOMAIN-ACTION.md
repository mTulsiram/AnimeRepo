# 🔗 Custom Domain Setup - Action Required

Your CNAME file is ready! Now you need to configure DNS in Cloudflare.

## ✅ What's Done
- [x] CNAME file created and pushed to GitHub
- [x] V2 deployed to GitHub Pages

## ⚠️ What YOU Need to Do

### STEP 1: Go to Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com
2. Select your domain: **bluetext.in**
3. Click on **DNS** in the left sidebar

### STEP 2: Add DNS Records

Create this DNS record:

```
TYPE: CNAME
NAME: anime
TARGET: mTulsiram.github.io
TTL: Auto
Proxy: Proxied (orange cloud icon)
```

**Visual steps:**
1. Click **Add Record** button
2. Select **CNAME** from dropdown
3. Name field: `anime`
4. Target field: `mTulsiram.github.io`
5. Proxy status: Toggle to **Proxied** (should be orange cloud)
6. Click **Save**

### STEP 3: Enable HTTPS

1. In Cloudflare, go to **SSL/TLS** section
2. Click **Edge Certificates**
3. Find "Always Use HTTPS" → Toggle **ON**
4. Set "Minimum TLS Version" to **1.2**

### STEP 4: Go Back to GitHub

After DNS is configured (usually 5-10 minutes), go to:
https://github.com/mTulsiram/AnimeRepo/settings/pages

Check the box: ✓ **Enforce HTTPS**

### STEP 5: Test Your Domain

1. Wait 5-10 minutes for DNS to propagate
2. Open your browser
3. Go to: **https://anime.bluetext.in**
4. Should see the Anime Database V2!

---

## 🆘 Troubleshooting

**Domain shows blank page?**
- Wait 10-15 minutes for DNS propagation
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private window

**SSL certificate not working?**
- Wait 5 minutes after enabling HTTPS
- Check DNS propagation: https://dnschecker.org
- Verify cloudflare cloud is orange (proxied)

**Still not working?**
- Check CNAME record in Cloudflare shows correct target
- Verify GitHub Pages settings show custom domain
- Check GitHub repo has CNAME file in root

---

## ✨ Once It's Working

After domain is live, notify and we'll:
1. ✅ Set up Google AdSense monetization
2. ✅ Optimize performance
3. ✅ Add advanced features
