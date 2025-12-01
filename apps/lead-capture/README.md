# Lead Capture App - One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kevanbtc/eagle-eye69/tree/main/apps/lead-capture)

## Features

✅ **Lightweight** - Single HTML file, no build required  
✅ **Fast** - Loads in <1 second  
✅ **Source Tracking** - Tracks Nextdoor, Google, Facebook, Referral  
✅ **Neighborhood Attribution** - Pre-populated with NE Atlanta areas  
✅ **Email Notifications** - Instant alerts on new leads  
✅ **Mobile Responsive** - Works perfectly on phones  
✅ **No Database Required** - Uses Vercel KV (Redis)  

## Deploy Now

### Option 1: Vercel (Recommended)
```bash
cd apps/lead-capture
vercel
```

**Required Environment Variables:**
```env
KV_REST_API_URL=your-kv-url
KV_REST_API_TOKEN=your-kv-token
EMAIL_TO=your@email.com
```

### Option 2: Netlify
```bash
netlify deploy --prod
```

### Option 3: GitHub Pages
1. Push to GitHub
2. Go to Settings → Pages
3. Select `main` branch, `/apps/lead-capture` folder
4. Done! Your form is live at `https://yourusername.github.io/eagle-eye69/`

## Customization

### Change Colors
Edit the CSS in `index.html`:
```css
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Add Your Logo
Replace the emoji with an image:
```html
<img src="your-logo.png" alt="Eagle Eye" style="max-width: 200px;">
```

### Change Neighborhoods
Edit the `<select name="neighborhood">` options to match your service area.

### Email Integration
Set these environment variables for email notifications:

**SendGrid:**
```env
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=leads@eagleeye.com
EMAIL_TO=admin@eagleeye.com
```

**Resend:**
```env
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=leads@eagleeye.com
EMAIL_TO=admin@eagleeye.com
```

## Embed in Website

### Iframe Embed
```html
<iframe src="https://your-lead-form.vercel.app" width="100%" height="800px" frameborder="0"></iframe>
```

### Popup Modal
```html
<button onclick="document.getElementById('leadModal').style.display='block'">Get Estimate</button>
<div id="leadModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999;">
  <iframe src="https://your-lead-form.vercel.app" style="width:90%; height:90%; margin:5%;"></iframe>
  <button onclick="document.getElementById('leadModal').style.display='none'" style="position:absolute; top:20px; right:20px; background:white; padding:10px 20px; border:none; cursor:pointer;">Close</button>
</div>
```

## Connect to Main Platform

To send leads to your Eagle Eye dashboard, set:
```env
WEBHOOK_URL=https://your-eagle-eye.vercel.app/api/leads/capture
```

## Analytics

### Google Analytics
Add before `</head>`:
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
Add before `</head>`:
```html
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

## Tracking Performance

View your leads in Vercel KV:
```bash
vercel kv list leads:all
```

Or build a simple admin panel at `/admin.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Leads Dashboard</title>
</head>
<body>
  <h1>Recent Leads</h1>
  <div id="leads"></div>
  <script>
    fetch('/api/leads/list')
      .then(r => r.json())
      .then(leads => {
        document.getElementById('leads').innerHTML = leads.map(lead => `
          <div style="padding: 20px; margin: 10px; border: 1px solid #ddd;">
            <h3>${lead.name} - ${lead.serviceType}</h3>
            <p>Email: ${lead.email}</p>
            <p>Phone: ${lead.phone}</p>
            <p>Source: ${lead.source}</p>
            <p>Time: ${new Date(lead.timestamp).toLocaleString()}</p>
          </div>
        `).join('');
      });
  </script>
</body>
</html>
```

## Cost

- **Vercel KV:** Free tier includes 30,000 commands/month (enough for ~1,000 leads)
- **Vercel Hosting:** Free for hobby projects
- **Total:** $0/month for small businesses

## Support

Questions? Open an issue: https://github.com/kevanbtc/eagle-eye69/issues
