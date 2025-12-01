# 🏗️ Eagle Eye Infrastructure Guide

## 📋 Table of Contents
- [Docker Compose Deployment](#docker-compose-deployment)
- [Database Seeding](#database-seeding)
- [Health Checks](#health-checks)
- [Backup & Restore](#backup--restore)
- [Monitoring & Logging](#monitoring--logging)
- [CI/CD Pipeline](#cicd-pipeline)

---

## 🐳 Docker Compose Deployment

Deploy the entire stack with one command:

```powershell
# Start all services (PostgreSQL, Backend, Frontend)
npm run docker:up

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

### Services:
- **PostgreSQL** → `localhost:5432`
- **Backend API** → `localhost:5000`
- **Frontend** → `localhost:80`

### Environment Variables:
Create a `.env` file with:
```env
DATABASE_URL=postgresql://eagleuser:eagle123@postgres:5432/eagle_eye
JWT_SECRET=your-secret-key-minimum-32-chars
OPENAI_API_KEY=sk-your-key-here
```

### Health Checks:
All services include automatic health monitoring. Docker will restart unhealthy containers.

---

## 🌱 Database Seeding

Populate your database with sample data:

```powershell
# Run seed script
npm run db:seed
```

**What gets seeded:**
- ✅ Admin user (`admin@eagleeye.com` / `admin123`)
- ✅ Demo user (`demo@eagleeye.com` / `demo123`)
- ✅ 10 materials (Tesla Solar Roof, GAF Shingles, etc.)
- ✅ 6 lead sources (Nextdoor, Google, Facebook, etc.)
- ✅ Sample marketing campaign
- ✅ Demo project (Johns Creek roof + solar)

**Update seed data:**
Edit `prisma/seed.ts` to customize materials, neighborhoods, or demo data.

---

## 🏥 Health Checks

### Endpoints:

**Backend Health:**
```bash
GET /health
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-01T12:00:00.000Z",
  "database": "connected",
  "service": "eagle-eye-backend",
  "version": "2.0.0"
}
```

**Frontend Health:**
```bash
GET /health
```

### Docker Health Checks:
```powershell
# Check service health
docker-compose ps

# View health logs
docker inspect eagle-eye-backend --format='{{.State.Health.Status}}'
```

---

## 💾 Backup & Restore

### Backup Database

```powershell
# Manual backup (creates timestamped file)
npm run db:backup

# Automated daily backup
.\scripts\auto-backup.ps1
```

**Output:** `backups/eagle_eye_backup_YYYYMMDD_HHMMSS.sql.zip`

**Backup includes:**
- All database tables and data
- User accounts and roles
- Projects, estimates, materials
- Marketing campaigns and leads
- Compressed automatically

### Restore Database

```powershell
# Restore from backup
npm run db:restore -- -BackupFile backups/eagle_eye_backup_20241201_120000.sql

# Force restore (skip confirmation)
.\scripts\restore-database.ps1 -BackupFile backup.sql -Force
```

⚠️ **Warning:** Restore will DELETE all existing data!

### Automated Backups

**Windows Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task → Name: "Eagle Eye Backup"
3. Trigger: Daily at 2:00 AM
4. Action: Start a program
   - Program: `powershell.exe`
   - Arguments: `-File "C:\path\to\scripts\auto-backup.ps1"`

**Retention:**
- Keeps last 30 days of backups
- Automatically deletes older backups
- Stores compressed backups to save space

---

## 📊 Monitoring & Logging

### Winston Logging

**Log files:** (created automatically in `logs/` directory)
- `combined.log` - All logs
- `error.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

**Log levels:**
- `error` - Critical errors
- `warn` - Warnings
- `info` - General information
- `http` - HTTP requests
- `debug` - Debug information

**Usage in code:**
```typescript
import logger from './server/utils/logger.js';

logger.info('User logged in');
logger.error('Database connection failed');
logger.http('GET /api/projects 200 - 45ms');
```

### Sentry Error Tracking

**Setup:**
1. Sign up at [sentry.io](https://sentry.io)
2. Create new project
3. Add to `.env.production`:
```env
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ENVIRONMENT=production
```

**Features:**
- Automatic error capture
- Performance monitoring
- Request tracing
- User context tracking
- Source maps for debugging

**Manual error tracking:**
```typescript
import { captureError, captureMessage } from './server/utils/sentry.js';

try {
  // Your code
} catch (error) {
  captureError(error, { userId: '123', action: 'create_project' });
}
```

### Request Logging Middleware

Add to `server/index.ts`:
```typescript
import { requestLogger, errorLogger } from './server/middleware/logging.js';

app.use(requestLogger);  // Log all requests
// ... your routes ...
app.use(errorLogger);    // Log errors
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

**1. CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
- Triggers: Push to `main`/`develop`, Pull Requests
- Jobs:
  - ✅ Lint & TypeScript type check
  - ✅ Build frontend & backend
  - ✅ Build Docker images
  - ✅ Database schema validation
  - ✅ Deploy to production (manual)

**2. Docker Publish** (`.github/workflows/docker-publish.yml`)
- Triggers: Release published
- Publishes Docker images to GitHub Container Registry
- Tags: `latest`, version numbers

### Setup GitHub Actions:

**1. Add Repository Secrets:**
- Go to: Settings → Secrets and variables → Actions
- Add:
  - `VERCEL_TOKEN` (from vercel.com/account/tokens)
  - `VERCEL_ORG_ID` (from `.vercel/project.json`)
  - `VERCEL_PROJECT_ID` (from `.vercel/project.json`)
  - `DOCKER_USERNAME` (optional, for Docker Hub)
  - `DOCKER_PASSWORD` (optional, for Docker Hub)

**2. Enable GitHub Pages:**
- Settings → Pages
- Source: GitHub Actions
- Workflow already configured in `.github/workflows/deploy.yml`

### Manual Deployment:

```powershell
# Deploy to Vercel
vercel --prod

# Deploy with Docker Compose
docker-compose -f docker-compose.yml up -d

# Deploy to Railway (via CLI)
railway up
```

---

## 📝 Additional Scripts

### Database Management:
```powershell
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Open Prisma Studio (visual editor)
npm run db:studio

# Seed database with sample data
npm run db:seed
```

### Docker Commands:
```powershell
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# View logs (follow mode)
npm run docker:logs

# Rebuild images
npm run docker:build
```

### Development:
```powershell
# Start both frontend + backend
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Build for production
npm run build
```

---

## 🔒 Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong JWT_SECRET (32+ characters)
   - Rotate secrets regularly

2. **Database:**
   - Use strong passwords
   - Enable SSL in production
   - Restrict network access
   - Regular backups

3. **API:**
   - Implement rate limiting
   - Use HTTPS in production
   - Validate all inputs
   - Enable CORS properly

4. **Monitoring:**
   - Enable Sentry error tracking
   - Set up alerts for critical errors
   - Monitor database performance
   - Track API response times

---

## 🆘 Troubleshooting

### Docker Issues:
```powershell
# Check service status
docker-compose ps

# View logs for specific service
docker-compose logs backend

# Restart service
docker-compose restart backend

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database Issues:
```powershell
# Check database connection
docker exec eagle-eye-db psql -U eagleuser -d eagle_eye -c "SELECT 1"

# Reset database
docker-compose down
docker volume rm eagle-eye-software_postgres_data
docker-compose up -d
npm run db:push
npm run db:seed
```

### Build Issues:
```powershell
# Clear node_modules
Remove-Item -Recurse -Force node_modules
npm install

# Clear Prisma cache
Remove-Item -Recurse -Force node_modules/.prisma
npm run db:generate

# Clear build artifacts
Remove-Item -Recurse -Force dist
npm run build
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Sentry Documentation](https://docs.sentry.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)

---

**Need help?** Open an issue at: https://github.com/kevanbtc/eagle-eye69/issues
