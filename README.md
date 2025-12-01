# Eagle Eye Construction Estimating System 🏗️ v2.0

## Complete AI-Powered Construction Management Platform

Full-stack construction estimating and project coordination system featuring:
- **AI-Powered Estimating** - Automatic cost predictions, blueprint analysis, material recommendations
- **AI Coordination Hub** - Intelligent scheduling, meeting management, phone call tracking  
- **AI Imagery & Remodeling** - Generate photorealistic renderings, remodel concepts, before/after visualizations
- **Excel Integration** - Professional .xlsx export compatible with Microsoft 365
- **Green Building Database** - Sustainable materials, solar-ready components, energy certifications
- **Investor Dashboard** - Portfolio analytics, project tracking, ROI metrics
- **Vault Integration** - Unykorn tokenization API for asset management

---

## 🆕 What's New in v2.0

✅ **AI Coordination Hub** - Smart scheduling with appointment/meeting/call management
✅ **AI Imagery & Remodeling** - DALL-E 3 renderings, before/after visualization  
✅ **Advanced AI Estimating** - Blueprint analysis, auto-generate complete estimates
✅ **Passthrough Camera Integration** - Upload job site photos for AI analysis
✅ **Material Recommendations** - AI suggests optimal materials per budget/style
✅ **Timeline Estimation** - AI calculates construction schedules with critical paths
✅ **Notification System** - Real-time alerts for all activities
✅ **Remodeling Projects** - Track design concepts from concept through approval

---

## 🎯 New Capabilities

### 1. AI Estimating Engine

**Auto-Generate Complete Estimates**
```typescript
POST /api/ai/auto-estimate
{
  "projectDescription": "3-bedroom modern home with solar roof",
  "squareFootage": 2400,
  "projectType": "SOLAR_READY",
  "includeGreen": true
}
```
Returns complete estimate with 30-50 line items across all categories.

**Blueprint Analysis with Vision AI**
```typescript
POST /api/ai/analyze-blueprint
{ "imageUrl": "https://...", "projectType": "RENOVATION" }
```
Extracts dimensions, room counts, materials, labor estimates from plans.

**Material Recommendations**
```typescript
POST /api/ai/recommend-materials
{ "projectType": "GREEN_BUILD", "budget": "medium" }
```
AI suggests materials with pros/cons, cost comparisons, green alternatives.

### 2. AI Coordination Hub

**Smart Scheduling** - AI analyzes availability and suggests optimal meeting times
**Phone Call Management** - Log calls, AI-generated summaries from transcripts
**Meeting Notes** - Auto-generate minutes, action items, decisions from recordings
**Notifications** - Real-time alerts for appointments, estimates, project updates

Navigate to **AI Coordination** in the sidebar to access appointments, calls, and meetings.

### 3. AI Imagery & Remodeling

**Generate Design Concepts**
```typescript
POST /api/imagery/generate-remodel-concept
{
  "description": "Modern kitchen with island",
  "style": "contemporary",
  "room": "kitchen"
}
```
Creates photorealistic 1024x1024 rendering with DALL-E 3.

**Before/After Visualization**
Upload existing space photo → AI analyzes → generates transformed design

**Styles Available:** Modern, Traditional, Industrial, Farmhouse, Coastal, Luxury, Sustainable, Minimalist

Navigate to **AI Imagery** in the sidebar for generation tools and gallery.

---

## 🏗️ Architecture

### Frontend
- **React 18** + TypeScript + Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Recharts** for analytics visualizations

### Backend
- **Node.js** + Express + TypeScript
- **Prisma ORM** with PostgreSQL
- **JWT** authentication
- **ExcelJS** for Excel template generation
- **OpenAI API** for AI cost predictions

### Key Features
1. **Project Management** - Track construction projects from planning to completion
2. **Estimate Builder** - Create detailed cost estimates with line items
3. **Materials Database** - Comprehensive catalog with green/solar-ready materials
4. **AI Cost Engine** - Intelligent cost predictions and optimization
5. **Excel Export** - Generate professional Excel estimates (STACK/Buildxact compatible)
6. **Investor Dashboard** - Portfolio analytics, ROI tracking, project performance
7. **Vault Integration** - Tokenization APIs for RWA (Real World Assets)
8. **Power BI Ready** - Export formats for BI dashboards

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** 14+
- **OpenAI API Key** (for AI features)

### Installation

1. **Clone and install dependencies:**
```powershell
npm install
```

2. **Set up environment variables:**
```powershell
Copy-Item .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secure random string for auth
- `OPENAI_API_KEY` - Your OpenAI API key
- `STACK_API_KEY` / `BUILDXACT_API_KEY` (optional)
- `VAULT_API_URL` / `VAULT_API_KEY` (for tokenization)

3. **Set up database:**
```powershell
npm run db:generate
npm run db:push
```

4. **Start development servers:**
```powershell
npm run dev
```

Frontend: `http://localhost:3000`  
Backend API: `http://localhost:5000`

## 📁 Project Structure

```
eagle-eye-estimating/
├── src/                        # Frontend React app
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx      # Main analytics dashboard
│   │   ├── Projects.tsx       # Project listing/management
│   │   ├── Estimates.tsx      # Estimate builder/viewer
│   │   ├── Materials.tsx      # Materials database browser
│   │   └── InvestorDashboard.tsx  # Investor analytics
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Entry point
├── server/                    # Backend API
│   ├── routes/               # API route handlers
│   │   ├── projects.ts       # Project CRUD
│   │   ├── estimates.ts      # Estimate management
│   │   ├── materials.ts      # Materials catalog
│   │   ├── exports.ts        # Excel/CSV generation
│   │   ├── ai.ts             # AI cost predictions
│   │   ├── vault.ts          # Tokenization APIs
│   │   └── auth.ts           # Authentication
│   └── index.ts              # Express server setup
├── prisma/
│   └── schema.prisma         # Database schema
├── exports/                  # Generated Excel files
└── package.json
```

## 🔌 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Estimates
- `GET /api/estimates` - List estimates (filterable by project)
- `GET /api/estimates/:id` - Get estimate with line items
- `POST /api/estimates` - Create estimate
- `PUT /api/estimates/:id` - Update estimate
- `POST /api/estimates/:id/line-items` - Add line item

### Materials
- `GET /api/materials` - Search materials (supports filters)
- `GET /api/materials/:id` - Get material details
- `GET /api/materials/meta/categories` - List categories
- `POST /api/materials` - Add new material
- `POST /api/materials/:id/price-history` - Add price entry

### AI Features
- `POST /api/ai/predict-cost` - AI cost prediction for materials
- `POST /api/ai/generate-estimate` - Generate estimate from description
- `POST /api/ai/optimize-estimate/:id` - Suggest cost optimizations

### Exports
- `POST /api/exports/estimate/:id/excel` - Generate Excel export
- `GET /api/exports/download/:fileName` - Download export file

### Vault/Tokenization
- `POST /api/vault/tokenize/:projectId` - Tokenize project asset
- `GET /api/vault/assets/:projectId` - List vault assets
- `GET /api/vault/asset/:id/status` - Check asset status

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

## 📊 Database Schema

**Key Models:**
- `User` - System users (estimators, investors, contractors)
- `Project` - Construction projects
- `Estimate` - Cost estimates with line items
- `EstimateLineItem` - Individual cost items
- `Material` - Materials catalog with pricing
- `MaterialPriceHistory` - Historical price tracking
- `EstimateExport` - Export file metadata
- `VaultAsset` - Tokenized assets
- `AIEstimateLog` - AI usage tracking

## 🔄 Workflow: Estimate → Excel → Investor Dashboard

### 1. Create Estimate
```typescript
// Use AI to generate initial estimate
POST /api/ai/generate-estimate
{
  "projectDescription": "1800 sq ft solar-ready spec home",
  "projectType": "GREEN_BUILD",
  "squareFootage": 1800
}
```

### 2. Refine with Materials Database
- Browse materials with green/solar filters
- Add specific line items with real pricing
- AI suggests cost optimizations

### 3. Export to Excel
```typescript
POST /api/exports/estimate/:id/excel
// Generates formatted .xlsx compatible with STACK/Buildxact
```

### 4. Track in Investor Dashboard
- Portfolio value aggregation
- Project status distribution
- ROI and margin analytics
- Power BI export for deeper analysis

### 5. Tokenize Assets (Optional)
```typescript
POST /api/vault/tokenize/:projectId
{
  "assetType": "PROPERTY_EQUITY",
  "value": 250000,
  "metadata": { "shares": 1000 }
}
```

## 🌱 Green Materials Features

The system includes special support for sustainable construction:
- **Green Materials Flag** - Identify eco-friendly options
- **Solar-Ready Components** - Track solar integration materials
- **Certifications** - Store LEED, Energy Star, etc.
- **Carbon Footprint** - Track environmental impact
- **Energy Ratings** - Compare efficiency metrics

## 💼 Investor Dashboard Metrics

- **Portfolio Value** - Total estimated project value
- **Active Projects** - Current builds in progress
- **Profit Margin** - Average markup across estimates
- **ROI Tracking** - Return on investment calculations
- **Project Distribution** - By type, status, region
- **Performance Trends** - Historical analytics

## 🔐 Security Notes

- JWT tokens expire after 7 days
- Passwords hashed with bcrypt (10 rounds)
- API keys stored in environment variables
- Database credentials never committed to git

## 🧪 Development

**Database Management:**
```powershell
npm run db:studio  # Open Prisma Studio GUI
npm run db:push    # Push schema changes to DB
```

**Build for Production:**
```powershell
npm run build
```

## 📝 Next Steps

1. **Seed Database** - Add sample materials/projects
2. **Authentication UI** - Build login/register pages
3. **STACK/Buildxact Import** - Parse external estimate files
4. **Power BI Templates** - Create dashboard templates
5. **Mobile Responsive** - Optimize for tablets/phones
6. **File Upload** - Support plan PDFs for AI analysis
7. **Real-time Collaboration** - WebSocket for multi-user editing

## 🤝 Integration Partners

- **STACK** - Takeoff and estimating platform
- **Buildxact** - Residential estimating software
- **Microsoft 365** - Excel export compatibility
- **Power BI** - Business intelligence dashboards
- **Unykorn Vault** - Asset tokenization platform
- **OpenAI** - AI cost prediction engine

## 📞 Support

For questions or issues, contact the Eagle Eye development team.

---

**Built with ❤️ for efficient, intelligent construction estimating**
