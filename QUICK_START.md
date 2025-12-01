# 🚀 Quick Start Guide - Eagle Eye v2.0

## ⚡ Get Started in 3 Steps

### Step 1: Start Docker Desktop
Open Docker Desktop application on your computer. Wait for it to fully start (green icon in system tray).

### Step 2: Set Up Database
```powershell
.\setup-database.ps1
```

This script will:
- ✅ Create PostgreSQL database in Docker
- ✅ Initialize all 22 database models
- ✅ Configure connection automatically

### Step 3: Start the App
```powershell
npm run dev
```

Then open **http://localhost:3001** in your browser!

---

## 📝 Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Start Docker Desktop
Make sure Docker Desktop is running.

### 2. Create Database Container
```powershell
docker run --name eagle-eye-db `
  -e POSTGRES_PASSWORD=eagle123 `
  -e POSTGRES_USER=eagleuser `
  -e POSTGRES_DB=eagle_eye `
  -p 5432:5432 `
  -d postgres:16-alpine
```

### 3. Push Schema to Database
```powershell
npm run db:push
```

### 4. Start Development Servers
```powershell
npm run dev
```

---

## 🔑 Add Your OpenAI API Key (Optional)

To use AI features (auto-estimates, image generation, scheduling):

1. Get API key from: https://platform.openai.com/api-keys
2. Edit `.env` file:
   ```env
   OPENAI_API_KEY=sk-proj-YOUR-ACTUAL-KEY-HERE
   ```
3. Restart servers: `npm run dev`

**Without API key:** App works in demo mode with sample data!

---

## 🗄️ Database Commands

### View/Edit Data (Prisma Studio)
```powershell
npm run db:studio
```
Opens visual database editor at http://localhost:5555

### Stop Database
```powershell
docker stop eagle-eye-db
```

### Start Database (if stopped)
```powershell
docker start eagle-eye-db
```

### Remove Database (to start fresh)
```powershell
docker rm -f eagle-eye-db
.\setup-database.ps1  # Create new one
```

### Check Database Status
```powershell
docker ps  # See running containers
```

---

## 🌐 Application URLs

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:5000
- **Database Studio:** http://localhost:5555 (run `npm run db:studio`)

---

## 📱 Features to Explore

### 1. Dashboard
Overview of projects, estimates, and statistics

### 2. Projects
Create construction projects, track progress

### 3. Estimates  
Generate cost estimates with Excel export

### 4. Materials
Browse green/sustainable building materials

### 5. AI Coordination 🆕
- Schedule appointments with AI
- Log phone calls with AI summaries
- Manage meetings with AI notes
- View notifications

### 6. AI Imagery 🆕
- Generate remodel concepts (DALL-E 3)
- Create before/after visualizations
- Design floor plans from descriptions
- Browse image gallery

### 7. Investor Dashboard
Portfolio analytics and ROI tracking

---

## 🔧 Troubleshooting

### "Docker is not running"
**Solution:** Open Docker Desktop and wait for it to start completely.

### "Port 5432 is already in use"
**Solution:** Another PostgreSQL instance is running.
```powershell
# Find what's using the port
netstat -ano | findstr :5432

# Stop other PostgreSQL or use different port in .env
```

### "Environment variable not found: DATABASE_URL"
**Solution:** Check `.env` file exists and has correct format:
```env
DATABASE_URL="postgresql://eagleuser:eagle123@localhost:5432/eagle_eye?schema=public"
```

### "Cannot connect to database"
**Solution:** 
1. Check Docker is running: `docker ps`
2. Check container is running: `docker ps | findstr eagle-eye-db`
3. Start container: `docker start eagle-eye-db`

### Frontend shows errors
**Solution:** Demo mode works without database! Just browse the UI.

### AI features not working
**Solution:** Add your OpenAI API key to `.env` file, or use demo mode to explore UI.

---

## 🎯 Development Workflow

### Daily Startup
```powershell
# If database is stopped
docker start eagle-eye-db

# Start app
npm run dev
```

### Making Database Changes
```powershell
# 1. Edit prisma/schema.prisma
# 2. Push changes
npm run db:push

# 3. Restart servers
# Press Ctrl+C in terminal, then:
npm run dev
```

### Testing API Endpoints
Use Postman, Insomnia, or curl:
```powershell
# Example: Get projects
Invoke-RestMethod -Uri http://localhost:5000/api/projects

# Example: Create project (requires auth token)
Invoke-RestMethod -Uri http://localhost:5000/api/projects `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"Test Project","type":"SINGLE_FAMILY"}'
```

---

## 📚 Additional Resources

- **Full Documentation:** See `README.md`
- **Release Notes:** See `V2_RELEASE_NOTES.md`
- **API Endpoints:** See `README.md` (50+ endpoints)
- **Prisma Studio:** `npm run db:studio` for visual database editor

---

## 🎉 You're Ready!

Run the setup script and start building:
```powershell
.\setup-database.ps1
npm run dev
```

**Open http://localhost:3001 and explore your AI-powered construction platform!** 🏗️✨
