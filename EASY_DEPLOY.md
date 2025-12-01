# 🚀 Eagle Eye - WORKING Deployment Guide

## Problem: Vercel CLI not installed? No worries!

Here are deployment methods that **actually work** without installing anything extra.

---

## ✅ Method 1: GitHub Pages (100% Free, No Tools Needed)

### Step 1: Enable GitHub Pages
1. Go to: https://github.com/kevanbtc/eagle-eye69/settings/pages
2. Under "Build and deployment":
   - Source: **GitHub Actions**
3. Click **Save**

### Step 2: Push Code (Already Done!)
Your site will automatically deploy when you push to `main` branch.

**Your website will be live at:**
```
https://kevanbtc.github.io/eagle-eye69/
```

**What's included:**
- ✅ Professional landing page
- ✅ Feature showcase
- ✅ One-click deploy buttons
- ✅ Mobile responsive

---

## ✅ Method 2: Vercel (Via Web Interface - No CLI)

### Step 1: Go to Vercel Website
1. Visit: https://vercel.com/new
2. Click "Continue with GitHub"
3. Import `kevanbtc/eagle-eye69`

### Step 2: Configure Project
- **Framework Preset:** Vite
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Step 3: Add Environment Variables
```env
DATABASE_URL=your_postgres_url_here
OPENAI_API_KEY=sk-your-openai-key
JWT_SECRET=your-secret-min-32-chars
```

### Step 4: Click Deploy
Done! Your app will be live at: `https://eagle-eye-construction.vercel.app`

---

## ✅ Method 3: Render (Free Tier Available)

### Step 1: Go to Render
1. Visit: https://render.com/
2. Click "Get Started for Free"
3. Connect your GitHub account

### Step 2: New Web Service
1. Click "New +" → "Web Service"
2. Select `kevanbtc/eagle-eye69`
3. Configure:
   - **Name:** eagle-eye-construction
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run dev`

### Step 3: Add Environment Variables
Same as Vercel (DATABASE_URL, OPENAI_API_KEY, JWT_SECRET)

### Step 4: Create Web Service
Your app will be live at: `https://eagle-eye-construction.onrender.com`

---

## ✅ Method 4: Railway (Easiest Database Setup)

### Step 1: Go to Railway
1. Visit: https://railway.app/
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"

### Step 2: Add PostgreSQL
Railway will automatically detect you need PostgreSQL and offer to add it!
- Click "Add PostgreSQL"
- DATABASE_URL is automatically set

### Step 3: Deploy
That's it! Railway handles everything.

**Live at:** `https://eagle-eye-construction.up.railway.app`

---

## ✅ Method 5: Netlify (Great for Static + Functions)

### Step 1: Go to Netlify
1. Visit: https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select `kevanbtc/eagle-eye69`

### Step 2: Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Step 3: Deploy
Click "Deploy site"

**Live at:** `https://eagle-eye-construction.netlify.app`

---

## 🎯 RECOMMENDED FOR BEGINNERS

### Option A: Just the Website (No Backend)
✅ **Use GitHub Pages** (Free, automatic)
- Professional landing page
- No setup required
- Already configured!

### Option B: Full Platform with Database
✅ **Use Railway** (Free tier, easiest database)
- Automatic PostgreSQL setup
- No configuration needed
- One-click deploy

### Option C: Lead Capture Form Only
✅ **Use Netlify** (Perfect for simple forms)
- Serverless functions included
- No database needed
- Form submissions via Netlify Forms

---

## 📝 Lead Capture Form (No Database Version)

I'll create a simpler version that works with **Netlify Forms** (built-in, no coding):

### File: `apps/lead-capture-simple/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Get Free Estimate - Eagle Eye</title>
</head>
<body>
    <form name="contact" method="POST" data-netlify="true">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="tel" name="phone" placeholder="Phone" required />
        <select name="service" required>
            <option value="">Select service...</option>
            <option value="roof">Roof Repair</option>
            <option value="remodel">Kitchen/Bath Remodel</option>
            <option value="storm">Storm Damage</option>
        </select>
        <textarea name="details" placeholder="Project details..."></textarea>
        <button type="submit">Get Free Estimate</button>
    </form>
</body>
</html>
```

Deploy to Netlify and form submissions automatically go to your email!

---

## 🔥 Quick Deploy Links (Click to Deploy)

### GitHub Pages (Website Only)
Already set up! Just enable in settings:
- https://github.com/kevanbtc/eagle-eye69/settings/pages

### Vercel (Full Platform)
- https://vercel.com/new/clone?repository-url=https://github.com/kevanbtc/eagle-eye69

### Render (Full Platform)
- https://render.com/deploy?repo=https://github.com/kevanbtc/eagle-eye69

### Railway (Full Platform)
- https://railway.app/new/template?template=https://github.com/kevanbtc/eagle-eye69

### Netlify (Website + Forms)
- https://app.netlify.com/start/deploy?repository=https://github.com/kevanbtc/eagle-eye69

---

## 🛠️ Local Development (No Deployment)

Want to run locally first?

```powershell
# 1. Install dependencies
npm install

# 2. Start PostgreSQL (Docker)
docker run --name eagle-eye-db -e POSTGRES_PASSWORD=eagle123 -e POSTGRES_USER=eagleuser -e POSTGRES_DB=eagle_eye -p 5432:5432 -d postgres:16-alpine

# 3. Set environment variable
$env:DATABASE_URL="postgresql://eagleuser:eagle123@localhost:5432/eagle_eye"

# 4. Push database schema
npm run db:push

# 5. Start backend (Terminal 1)
npm run dev

# 6. Start frontend (Terminal 2)
npm run client
```

**Access locally:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:5000
- Database Studio: npm run db:studio

---

## ❓ Which Should You Choose?

| Platform | Best For | Database | Cost |
|----------|----------|----------|------|
| **GitHub Pages** | Website/Docs only | No | Free |
| **Railway** | Full platform + easy DB | Yes (included) | Free tier |
| **Vercel** | Full platform + serverless | External | Free tier |
| **Render** | Full platform | Yes (extra) | Free tier |
| **Netlify** | Static site + forms | No | Free tier |

**My recommendation:**
1. **GitHub Pages** - Enable now for professional website
2. **Railway** - Deploy full platform (easiest database setup)
3. **Netlify** - Deploy simple lead form separately

---

## 🆘 Still Having Issues?

### Issue: "Command not found"
✅ **Solution:** Use web interfaces instead of CLI
- All platforms have web dashboards
- No terminal commands needed

### Issue: "Build failed"
✅ **Solution:** Check environment variables
- Make sure DATABASE_URL is set
- JWT_SECRET needs to be at least 32 characters

### Issue: "Database connection failed"
✅ **Solution:** Use Railway
- It sets up PostgreSQL automatically
- No manual configuration needed

---

## 📞 Need Help?

Drop an issue: https://github.com/kevanbtc/eagle-eye69/issues

Or just enable GitHub Pages for now and deal with full deployment later!
