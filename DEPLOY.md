# Deploy Eagle Eye to Vercel (One-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kevanbtc/eagle-eye69&env=DATABASE_URL,OPENAI_API_KEY,JWT_SECRET&envDescription=Required%20environment%20variables%20for%20Eagle%20Eye&project-name=eagle-eye-construction&repository-name=eagle-eye-construction)

## Quick Deploy Options

### 🚀 Option 1: Full Platform (Recommended)

Deploy the complete Eagle Eye platform with all features:

**One-Click Deploy:**
- Frontend + Backend
- PostgreSQL Database (via Vercel Postgres)
- Authentication
- Marketing Dashboard
- AI Imagery
- Lead Management

**Required Environment Variables:**
```env
DATABASE_URL=your_postgres_connection_string
OPENAI_API_KEY=sk-your-openai-key
JWT_SECRET=your-secret-key-here
```

**Deploy Now:**
```bash
# Option A: Using Vercel CLI
npm i -g vercel
vercel

# Option B: Using Vercel Button
# Click the "Deploy with Vercel" button above
```

---

### 📝 Option 2: Lead Capture Landing Page

Lightweight public-facing lead form only.

**Features:**
- Source tracking (Nextdoor, Google, Facebook)
- Neighborhood attribution
- Email notifications
- No database required (uses Vercel KV)

**Deploy Command:**
```bash
vercel --name eagle-eye-leads
```

**Environment Variables:**
```env
EMAIL_TO=your@email.com
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

---

### 📊 Option 3: Marketing Dashboard Only

Standalone analytics platform for tracking ROI.

**Features:**
- Campaign management
- Budget planner
- Cost-per-lead tracking
- Neighborhood performance

**Deploy Command:**
```bash
vercel --name eagle-eye-marketing
```

**Environment Variables:**
```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your-secret-key-here
```

---

### 🤖 Option 4: AI Estimate Generator

Quick estimate tool with natural language input.

**Features:**
- AI-powered cost estimation
- PDF export
- Email delivery
- No login required

**Deploy Command:**
```bash
vercel --name eagle-eye-estimator
```

**Environment Variables:**
```env
OPENAI_API_KEY=sk-your-openai-key
EMAIL_TO=your@email.com
```

---

### 👥 Option 5: Client Portal

Self-service portal for homeowners.

**Features:**
- Project tracking
- Document sharing
- Payment tracking
- Photo galleries

**Deploy Command:**
```bash
vercel --name eagle-eye-portal
```

**Environment Variables:**
```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your-secret-key-here
STRIPE_SECRET_KEY=sk_test_your-key
```

---

### 📆 Option 6: Appointment Scheduler Widget

Embeddable scheduling widget.

**Features:**
- Real-time availability
- Calendar sync
- SMS/Email reminders
- Embeddable iframe

**Deploy Command:**
```bash
vercel --name eagle-eye-scheduler
```

**Environment Variables:**
```env
DATABASE_URL=your_postgres_connection_string
GOOGLE_CALENDAR_API_KEY=your-key
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE=+1234567890
```

---

## Alternative Deployment Platforms

### Deploy to Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/kevanbtc/eagle-eye69)

### Deploy to Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/kevanbtc/eagle-eye69)

### Deploy to Heroku
```bash
heroku create eagle-eye-construction
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Deploy to DigitalOcean App Platform
```bash
doctl apps create --spec .do/app.yaml
```

### Deploy to Azure Static Web Apps
```bash
az staticwebapp create \
  --name eagle-eye-construction \
  --resource-group eagle-eye-rg \
  --source https://github.com/kevanbtc/eagle-eye69 \
  --location "East US" \
  --branch main \
  --app-location "/" \
  --api-location "server" \
  --output-location "dist"
```

---

## Post-Deployment Setup

### 1. Initialize Database
```bash
npx prisma db push
```

### 2. Create Admin User
```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eagleeye.com",
    "password": "secure-password",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

### 3. Configure Domains
In Vercel dashboard:
- Add custom domain: `eagleeyeconstruction.com`
- Add lead form subdomain: `leads.eagleeyeconstruction.com`
- Add client portal: `portal.eagleeyeconstruction.com`

### 4. Set Up Webhooks (Optional)
```bash
# For Nextdoor lead notifications
curl -X POST https://your-app.vercel.app/api/webhooks/nextdoor \
  -H "Content-Type: application/json" \
  -d '{"webhook_url": "https://your-app.vercel.app/api/leads/capture"}'
```

---

## Environment Variables Reference

### Core Platform
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
JWT_SECRET=your-secret-key-minimum-32-characters

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-openai-key

# Node Environment
NODE_ENV=production
```

### Email (Optional)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@eagleeye.com
```

### SMS (Optional - for appointment reminders)
```env
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE=+1234567890
```

### Payment Processing (Optional)
```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### File Storage (Optional - for large file uploads)
```env
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_STORAGE_CONTAINER=uploads
# OR
AWS_S3_BUCKET=eagle-eye-uploads
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

### Calendar Integration (Optional)
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_REDIRECT_URI=https://your-app.vercel.app/api/auth/google/callback
```

---

## Monitoring & Analytics

### Add Analytics
```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=your-token
```

### Error Tracking
```env
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### Performance Monitoring
```env
VERCEL_ANALYTICS_ID=auto-detected
```

---

## Scaling Configuration

### Vercel Pro Features
- Automatic edge caching
- Serverless functions (1000 GB-hours/month)
- PostgreSQL (via Vercel Postgres)
- KV storage (via Vercel KV)
- Blob storage (via Vercel Blob)

### Recommended Plan by Usage
- **Hobby (Free):** Testing, personal use
- **Pro ($20/mo):** Small business, <10,000 leads/mo
- **Enterprise:** Custom pricing for high-traffic

---

## Support & Documentation

- **GitHub Issues:** https://github.com/kevanbtc/eagle-eye69/issues
- **Full Docs:** https://github.com/kevanbtc/eagle-eye69/blob/main/README.md
- **API Reference:** https://github.com/kevanbtc/eagle-eye69/blob/main/docs/API.md
- **Contributing:** https://github.com/kevanbtc/eagle-eye69/blob/main/CONTRIBUTING.md
