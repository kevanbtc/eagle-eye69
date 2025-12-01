import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eagleeye.com' },
    update: {},
    create: {
      email: 'admin@eagleeye.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin user created');

  // Create demo estimator
  const estimatorPassword = await bcrypt.hash('demo123', 10);
  const estimator = await prisma.user.upsert({
    where: { email: 'demo@eagleeye.com' },
    update: {},
    create: {
      email: 'demo@eagleeye.com',
      password: estimatorPassword,
      name: 'Demo Estimator',
      role: 'ESTIMATOR'
    }
  });
  console.log('✅ Demo user created');

  // Seed Green Materials
  const materials = [
    {
      name: 'Tesla Solar Roof Tiles',
      type: 'SOLAR',
      category: 'Roofing',
      unit: 'SQ_FT',
      costPerUnit: 28.50,
      supplier: 'Tesla',
      description: 'Premium solar roof tiles with 25-year warranty',
      isGreen: true,
      carbonOffset: 2500
    },
    {
      name: 'GAF Timberline Solar Shingles',
      type: 'SOLAR',
      category: 'Roofing',
      unit: 'SQ_FT',
      costPerUnit: 22.00,
      supplier: 'GAF',
      description: 'Integrated solar shingles, aesthetically pleasing',
      isGreen: true,
      carbonOffset: 2000
    },
    {
      name: 'SunPower Maxeon Solar Panels',
      type: 'SOLAR',
      category: 'Solar System',
      unit: 'PANEL',
      costPerUnit: 450.00,
      supplier: 'SunPower',
      description: 'High-efficiency 400W solar panels',
      isGreen: true,
      carbonOffset: 300
    },
    {
      name: 'Owens Corning Eco-Touch Insulation',
      type: 'STANDARD',
      category: 'Insulation',
      unit: 'SQ_FT',
      costPerUnit: 1.80,
      supplier: 'Owens Corning',
      description: 'R-30 recycled fiberglass insulation',
      isGreen: true,
      carbonOffset: 50
    },
    {
      name: 'CertainTeed EcoSide Siding',
      type: 'STANDARD',
      category: 'Siding',
      unit: 'SQ_FT',
      costPerUnit: 8.50,
      supplier: 'CertainTeed',
      description: 'Recycled vinyl siding, low maintenance',
      isGreen: true,
      carbonOffset: 100
    },
    {
      name: 'James Hardie Fiber Cement Siding',
      type: 'STANDARD',
      category: 'Siding',
      unit: 'SQ_FT',
      costPerUnit: 12.00,
      supplier: 'James Hardie',
      description: 'Durable fiber cement, fire resistant',
      isGreen: false,
      carbonOffset: 0
    },
    {
      name: 'Tesla Powerwall 2',
      type: 'SOLAR',
      category: 'Energy Storage',
      unit: 'UNIT',
      costPerUnit: 11500.00,
      supplier: 'Tesla',
      description: '13.5 kWh lithium-ion battery storage',
      isGreen: true,
      carbonOffset: 1500
    },
    {
      name: 'Enphase IQ8 Microinverter',
      type: 'SOLAR',
      category: 'Solar System',
      unit: 'UNIT',
      costPerUnit: 180.00,
      supplier: 'Enphase',
      description: 'Grid-independent microinverter',
      isGreen: true,
      carbonOffset: 20
    },
    {
      name: 'EcoSmart LED Can Lights',
      type: 'STANDARD',
      category: 'Electrical',
      unit: 'UNIT',
      costPerUnit: 25.00,
      supplier: 'EcoSmart',
      description: 'Energy-efficient 6-inch recessed lighting',
      isGreen: true,
      carbonOffset: 10
    },
    {
      name: 'Low-E Triple Pane Windows',
      type: 'STANDARD',
      category: 'Windows',
      unit: 'UNIT',
      costPerUnit: 850.00,
      supplier: 'Pella',
      description: 'Energy-efficient triple pane with low-E coating',
      isGreen: true,
      carbonOffset: 200
    }
  ];

  for (const material of materials) {
    await prisma.material.upsert({
      where: { name: material.name },
      update: {},
      create: material
    });
  }
  console.log('✅ Materials seeded (10 items)');

  // Seed Lead Sources
  const leadSources = [
    { source: 'Nextdoor', totalLeads: 0, convertedLeads: 0, totalSpent: 0, totalRevenue: 0, avgCostPerLead: 0, avgConversionRate: 0 },
    { source: 'Google', totalLeads: 0, convertedLeads: 0, totalSpent: 0, totalRevenue: 0, avgCostPerLead: 0, avgConversionRate: 0 },
    { source: 'Facebook', totalLeads: 0, convertedLeads: 0, totalSpent: 0, totalRevenue: 0, avgCostPerLead: 0, avgConversionRate: 0 },
    { source: 'Instagram', totalLeads: 0, convertedLeads: 0, totalSpent: 0, totalRevenue: 0, avgCostPerLead: 0, avgConversionRate: 0 },
    { source: 'Referral', totalLeads: 0, convertedLeads: 0, totalSpent: 0, totalRevenue: 0, avgCostPerLead: 0, avgConversionRate: 0 },
    { source: 'Other', totalLeads: 0, convertedLeads: 0, totalSpent: 0, totalRevenue: 0, avgCostPerLead: 0, avgConversionRate: 0 }
  ];

  for (const leadSource of leadSources) {
    await prisma.leadSource.upsert({
      where: { source: leadSource.source },
      update: {},
      create: leadSource
    });
  }
  console.log('✅ Lead sources seeded (6 items)');

  // Seed Sample Marketing Campaign
  const campaign = await prisma.marketingCampaign.create({
    data: {
      name: 'Nextdoor NE Atlanta - Roof Repair',
      platform: 'Nextdoor',
      type: 'Local Deals',
      budget: 500.00,
      spent: 0,
      impressions: 0,
      clicks: 0,
      leads: 0,
      startDate: new Date(),
      status: 'ACTIVE'
    }
  });
  console.log('✅ Sample campaign created');

  // Seed Sample Project
  const project = await prisma.project.create({
    data: {
      name: 'Johns Creek Roof + Solar Installation',
      description: 'Complete roof replacement with integrated Tesla Solar Roof',
      address: '123 Medlock Bridge Rd, Johns Creek, GA 30097',
      type: 'SINGLE_FAMILY',
      status: 'PLANNING',
      userId: estimator.id
    }
  });
  console.log('✅ Sample project created');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
