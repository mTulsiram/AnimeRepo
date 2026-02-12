# 🔗 Setup anime.bluetext.in - Step by Step

## Your Current Setup
- ✅ Domain: **bluetext.in** 
- ✅ Cloudflare plan: **Free**
- ✅ Nameservers: Configured
- ✅ Email MX records: Already set up
- ✅ DKIM authentication: Already set up

---

## 📝 STEP 1: Add CNAME Record for anime subdomain

### In Your Cloudflare Dashboard:

1. **Go to:** Dashboard → bluetext.in → DNS

2. **Find the section** that lists your DNS records (you'll see the MX and TXT records)

3. **Click:** "Add record" or "Add a record" button

4. **Fill in the following:**
   - **Type:** Select `CNAME` from dropdown
   - **Name:** `anime` (this will create anime.bluetext.in)
   - **Target/Content:** `mTulsiram.github.io`
   - **Proxy status:** Click to toggle to **Proxied** (orange cloud ☁️)
   - **TTL:** Leave as `Auto`

5. **Click:** "Save"

### Expected Result:
```
Type    Name             Content                    Proxy Status    TTL
CNAME   anime            mTulsiram.github.io       Proxied ☁️      Auto
```

⏳ **Wait 2-5 minutes** for DNS to propagate

---

## 🔒 STEP 2: Enable HTTPS

1. **In Cloudflare Dashboard:**
   - Go to **SSL/TLS** (left sidebar)

2. **Click:** "Edge Certificates"

3. **Find:** "Always Use HTTPS" toggle
   - Click to toggle **ON** (should turn blue)

4. **Find:** "Minimum TLS Version"
   - Select: **1.2** or **1.3**

5. **Save** (if option appears)

### Your Settings Should Look Like:
```
✅ Always Use HTTPS: ON
✅ Minimum TLS Version: 1.2+
✅ Auto HTTPS Rewrites: ON (if available)
```

---

## ✅ STEP 3: Verify in GitHub

1. **Go to:** https://github.com/mTulsiram/AnimeRepo/settings/pages

2. **Look for:** "Custom domain" section

3. **The field should show:** `anime.bluetext.in`
   - If empty, enter it and click Save
   - If filled, just verify it shows correctly

4. **Look for:** Checkbox with text about enforcing HTTPS
   - ✅ Check the box: "Enforce HTTPS"

---

## 🧪 STEP 4: Test Your Domain

### Wait 5-10 minutes after DNS changes, then:

1. **Open your browser**

2. **Go to:** `https://anime.bluetext.in`

3. **You should see:**
   - ✅ Anime Database V2 loads
   - ✅ Filters work
   - ✅ Search bar works
   - ✅ No SSL certificate warnings
   - ✅ HTTPS lock icon in address bar

### If it shows GitHub 404:
- Wait another 5 minutes
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private window
- Check DNS propagation: https://dnschecker.org

---

## 🆘 Troubleshooting

### "DNS records are still propagating"
- **Solution:** Wait 10-15 minutes and refresh
- Check: https://dnschecker.org/?query=anime.bluetext.in

### "404 Not Found - github"
- **Verify:** CNAME file exists in repo
- Check GitHub settings has custom domain set
- Make sure proxy is Proxied (orange cloud)

### "SSL certificate error"
- **Solution:** Wait 5 minutes after HTTPS toggle
- Cloudflare SSL takes time to generate

### "anime.bluetext.in refuses to connect"
- **Check CNAME record:**
  - Name should be: `anime`
  - Content should be: `mTulsiram.github.io`
  - Proxy should be: Proxied (orange ☁️)

### "Works but shows 403 Forbidden"
- Make sure you're accessing with `https://` not `http://`
- Verify "Enforce HTTPS" is checked in GitHub

---

## ✨ Success Checklist

Once working, you should have:

- [x] CNAME record: `anime` → `mTulsiram.github.io` (Proxied)
- [x] HTTPS enabled in Cloudflare SSL/TLS
- [x] Custom domain set in GitHub Pages settings
- [x] HTTPS enforced in GitHub
- [x] DNS propagated (5-10 minutes passed)
- [x] Can access: https://anime.bluetext.in
- [x] Anime database loads successfully
- [x] HTTPS lock icon shows ✅
- [x] Filters and search work ✅

---

## 📋 Your DNS Will Look Like:

After adding the CNAME record, your DNS records should include:

```
Type    Name                 Content                  Proxy Status    TTL
MX      bluetext.in          route3.mx.cloudflare.net DNS only       Auto
MX      bluetext.in          route2.mx.cloudflare.net DNS only       Auto
MX      bluetext.in          route1.mx.cloudflare.net DNS only       Auto
TXT     cf2024-1._domainkey  [DKIM key...]           DNS only       Auto
CNAME   anime                mTulsiram.github.io     Proxied ☁️      Auto    ← NEW!
```

---

## 🎯 Next Actions

1. ✅ **Add CNAME record** (5 min)
2. ✅ **Enable HTTPS** in Cloudflare (2 min)
3. ✅ **Check GitHub Pages settings** (2 min)
4. ⏳ **Wait for DNS propagation** (5-10 min)
5. ✅ **Test at anime.bluetext.in** (1 min)

**Total time: ~20 minutes**

---

## 💬 Once Working

Reply with confirmation and I'll help you:
1. ✅ Set up Google AdSense
2. ✅ Integrate ads into the website
3. ✅ Deploy monetized version
4. ✅ Monitor analytics

---

**Need help? Reply with a screenshot of your DNS records after adding the CNAME!**
