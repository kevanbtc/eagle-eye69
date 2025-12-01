# Eagle Eye Construction Estimating System

Full-stack construction estimating platform with AI-powered cost prediction, Microsoft 365 Excel integration, STACK/Buildxact compatibility, materials database (green/solar-ready), investor dashboards, and Unykorn vault/tokenization integration.

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
