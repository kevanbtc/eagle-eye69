# 🚀 Eagle Eye - Quick Setup Guide

## ✅ Step 1: Enable GitHub Pages

1. Go to: https://github.com/kevanbtc/eagle-eye69/settings/pages
2. Under "Source", select: **Deploy from a branch**
3. Under "Branch", select: **main** and folder: **/docs**
4. Click **Save**

Your website will be live at: **https://kevanbtc.github.io/eagle-eye69/**

---

## 🎯 Step 2: Deploy Full Platform to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kevanbtc/eagle-eye69)

**Or using CLI:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Set Environment Variables in Vercel Dashboard:**
```env
DATABASE_URL=your_postgres_url
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your-secret-minimum-32-chars
```

**Your app will be live at:** `https://eagle-eye-construction.vercel.app`

---

## 📝 Step 3: Deploy Lead Capture Form (Optional)

**Super simple - no database needed!**

```bash
cd apps/lead-capture
vercel
```

**Set Environment Variables:**
```env
KV_REST_API_URL=your-kv-url
KV_REST_API_TOKEN=your-kv-token
EMAIL_TO=your@email.com
```

**Your lead form will be live at:** `https://eagle-eye-leads.vercel.app`

---

## 🔗 Step 4: Custom Domain (Optional)

### For Full Platform:
1. In Vercel dashboard, go to: **Settings → Domains**
2. Add: `eagleeyeconstruction.com`
3. Update DNS records (Vercel provides instructions)

### For Lead Capture:
Add subdomain: `leads.eagleeyeconstruction.com`

---

## 📊 Step 5: Set Up Analytics (Optional)

### Google Analytics
Add to `docs/index.html` before `</head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Facebook Pixel
Add your pixel ID to track Nextdoor/Facebook ad conversions.

---

## 🎨 Step 6: Customize Branding

### Update Website Colors
Edit `docs/index.html` line 14:
```css
background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
```
Change `#1e3a8a` and `#3b82f6` to your brand colors.

### Add Your Logo
Replace the 🦅 emoji with:
```html
<img src="your-logo.png" alt="Eagle Eye" style="max-width: 200px;">
```

---

## 📱 Step 7: Connect to Nextdoor

### Add Lead Form to Nextdoor Business Page
1. Go to: https://business.nextdoor.com/
2. Add website link: `https://eagleeyeconstruction.com`
3. Add lead form: `https://leads.eagleeyeconstruction.com`

### Add Tracking
In lead form, the source is automatically tracked as "Nextdoor" when traffic comes from there.

---

## 🔔 Step 8: Set Up Notifications

### Email Notifications
Already configured! When someone submits a lead, you'll get an email.

### SMS Notifications (Optional)
Add to your Vercel environment variables:
```env
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE=+1234567890
```

---

## 📈 Step 9: Track Your Marketing ROI

Login to your dashboard: `https://your-app.vercel.app/login`

**Default credentials:**
- Email: `demo@eagleeye.com`
- Password: `demo123`

**⚠️ IMPORTANT:** Change these immediately after first login!

Go to `/marketing` to:
- Add campaigns
- Track leads
- View neighborhood performance
- Calculate ROI

---

## 🛠️ Step 10: Customize Features

### Add More Neighborhoods
Edit `src/pages/Marketing.tsx` around line 250 to add more neighborhoods.

### Change Service Types
Edit `apps/lead-capture/index.html` around line 120 to add/remove services.

### Update Contact Info
Search for `(678) 555-1234` and replace with your actual phone number.

---

## 🚨 Troubleshooting

### Website not showing up?
- Wait 2-3 minutes after enabling GitHub Pages
- Check: https://github.com/kevanbtc/eagle-eye69/deployments
- Verify branch is set to `main` and folder is `/docs`

### Vercel deployment failed?
- Check environment variables are set correctly
- Ensure `DATABASE_URL` is a valid PostgreSQL connection string
- Run `npm install` locally first to verify dependencies

### Lead form not capturing?
- Check Vercel KV is enabled (free tier)
- Verify email environment variables are set
- Check browser console for errors

---

## 📚 Full Documentation

- **Deployment Guide:** [DEPLOY.md](./DEPLOY.md)
- **API Reference:** [Coming soon]
- **Marketing Guide:** [README.md](./README.md)

---

## 💬 Need Help?

- **GitHub Issues:** https://github.com/kevanbtc/eagle-eye69/issues
- **Email:** support@eagleeye.com
- **Phone:** (678) 555-1234

---

## 🎉 You're All Set!

Your complete construction platform is now live with:

✅ Professional website  
✅ Full estimating system  
✅ Marketing ROI tracker  
✅ Lead capture form  
✅ AI imagery generation  
✅ Client portal  
✅ Investor dashboard  

**Start getting leads from Nextdoor, Google, and Facebook!** 🚀
