import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get marketing stats overview
router.get('/stats', async (req, res) => {
  try {
    const campaigns = await prisma.marketingCampaign.findMany()
    const leads = await prisma.lead.findMany()

    const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.spent), 0)
    const totalRevenue = campaigns.reduce((sum, c) => sum + Number(c.revenue), 0)
    const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0)
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length

    const avgCostPerLead = totalLeads > 0 ? totalSpent / totalLeads : 0
    const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0
    const roi = totalSpent > 0 ? totalRevenue / totalSpent : 0

    res.json({
      totalSpent,
      totalRevenue,
      totalLeads,
      totalConversions,
      roi,
      avgCostPerLead,
      conversionRate,
      activeCampaigns
    })
  } catch (error) {
    console.error('Error fetching marketing stats:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Get all campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const { platform, status } = req.query

    const where: any = {}
    if (platform) where.platform = platform
    if (status) where.status = status

    const campaigns = await prisma.marketingCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { leadRecords: true }
        }
      }
    })

    res.json(campaigns)
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    res.status(500).json({ error: 'Failed to fetch campaigns' })
  }
})

// Create new campaign
router.post('/campaigns', async (req, res) => {
  try {
    const {
      name,
      platform,
      campaignType,
      budget,
      startDate,
      endDate,
      targetArea,
      adCopy,
      imageUrl,
      userId
    } = req.body

    const campaign = await prisma.marketingCampaign.create({
      data: {
        name,
        platform,
        campaignType,
        budget,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        targetArea,
        adCopy,
        imageUrl,
        userId,
        status: 'DRAFT'
      }
    })

    res.json(campaign)
  } catch (error) {
    console.error('Error creating campaign:', error)
    res.status(500).json({ error: 'Failed to create campaign' })
  }
})

// Update campaign
router.put('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Convert date strings to Date objects
    if (updates.startDate) updates.startDate = new Date(updates.startDate)
    if (updates.endDate) updates.endDate = new Date(updates.endDate)
    
    // Convert string numbers to proper types
    if (updates.budget) updates.budget = Number(updates.budget)
    if (updates.spent) updates.spent = Number(updates.spent)
    if (updates.revenue) updates.revenue = Number(updates.revenue)
    if (updates.impressions) updates.impressions = Number(updates.impressions)
    if (updates.clicks) updates.clicks = Number(updates.clicks)
    if (updates.leads) updates.leads = Number(updates.leads)
    if (updates.conversions) updates.conversions = Number(updates.conversions)

    const campaign = await prisma.marketingCampaign.update({
      where: { id },
      data: updates
    })

    res.json(campaign)
  } catch (error) {
    console.error('Error updating campaign:', error)
    res.status(500).json({ error: 'Failed to update campaign' })
  }
})

// Delete campaign
router.delete('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.marketingCampaign.delete({
      where: { id }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    res.status(500).json({ error: 'Failed to delete campaign' })
  }
})

// Get all leads
router.get('/leads', async (req, res) => {
  try {
    const { source, status, neighborhood } = req.query

    const where: any = {}
    if (source) where.source = source
    if (status) where.status = status
    if (neighborhood) where.neighborhood = neighborhood

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        campaign: {
          select: {
            name: true,
            platform: true
          }
        }
      }
    })

    res.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    res.status(500).json({ error: 'Failed to fetch leads' })
  }
})

// Create new lead
router.post('/leads', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      neighborhood,
      source,
      sourceNeighborhood,
      campaignId,
      serviceInterest,
      estimatedValue,
      priority,
      notes,
      userId
    } = req.body

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state: state || 'GA',
        zipCode,
        neighborhood,
        source,
        sourceNeighborhood,
        campaignId,
        serviceInterest,
        estimatedValue: estimatedValue ? Number(estimatedValue) : null,
        priority: priority || 'MEDIUM',
        status: 'NEW',
        notes,
        userId
      }
    })

    // Update campaign lead count if campaignId provided
    if (campaignId) {
      await prisma.marketingCampaign.update({
        where: { id: campaignId },
        data: {
          leads: {
            increment: 1
          }
        }
      })
    }

    // Update neighborhood performance
    if (neighborhood && city) {
      await updateNeighborhoodStats(neighborhood, city, state || 'GA')
    }

    res.json(lead)
  } catch (error) {
    console.error('Error creating lead:', error)
    res.status(500).json({ error: 'Failed to create lead' })
  }
})

// Update lead
router.put('/leads/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Convert date strings to Date objects
    if (updates.contactedAt) updates.contactedAt = new Date(updates.contactedAt)
    if (updates.quoteSentAt) updates.quoteSentAt = new Date(updates.quoteSentAt)
    if (updates.conversionDate) updates.conversionDate = new Date(updates.conversionDate)

    // Convert string numbers
    if (updates.estimatedValue) updates.estimatedValue = Number(updates.estimatedValue)
    if (updates.actualValue) updates.actualValue = Number(updates.actualValue)

    const lead = await prisma.lead.update({
      where: { id },
      data: updates
    })

    // If status changed to WON, update campaign conversion and revenue
    if (updates.status === 'WON' && lead.campaignId && updates.actualValue) {
      await prisma.marketingCampaign.update({
        where: { id: lead.campaignId },
        data: {
          conversions: {
            increment: 1
          },
          revenue: {
            increment: Number(updates.actualValue)
          }
        }
      })

      // Update neighborhood performance
      if (lead.neighborhood && lead.city) {
        await updateNeighborhoodStats(lead.neighborhood, lead.city, lead.state || 'GA')
      }
    }

    res.json(lead)
  } catch (error) {
    console.error('Error updating lead:', error)
    res.status(500).json({ error: 'Failed to update lead' })
  }
})

// Get neighborhood performance
router.get('/neighborhoods', async (req, res) => {
  try {
    const neighborhoods = await prisma.neighborhoodPerformance.findMany({
      orderBy: { roi: 'desc' }
    })

    res.json(neighborhoods)
  } catch (error) {
    console.error('Error fetching neighborhood performance:', error)
    res.status(500).json({ error: 'Failed to fetch neighborhood data' })
  }
})

// Get specific neighborhood stats
router.get('/neighborhoods/:neighborhood/:city', async (req, res) => {
  try {
    const { neighborhood, city } = req.params
    const { state = 'GA' } = req.query

    const stats = await prisma.neighborhoodPerformance.findUnique({
      where: {
        neighborhood_city_state: {
          neighborhood,
          city,
          state: state as string
        }
      }
    })

    if (!stats) {
      return res.status(404).json({ error: 'Neighborhood not found' })
    }

    res.json(stats)
  } catch (error) {
    console.error('Error fetching neighborhood stats:', error)
    res.status(500).json({ error: 'Failed to fetch neighborhood stats' })
  }
})

// Create or update budget plan
router.post('/budget-plans', async (req, res) => {
  try {
    const {
      name,
      tier,
      monthlyBudget,
      nextdoorBudget,
      googleBudget,
      facebookBudget,
      otherBudget,
      projectedLeads,
      projectedRevenue,
      projectedROI,
      active,
      startDate,
      endDate,
      userId
    } = req.body

    // Deactivate other plans if this one is active
    if (active) {
      await prisma.budgetPlan.updateMany({
        where: { active: true, userId },
        data: { active: false }
      })
    }

    const plan = await prisma.budgetPlan.create({
      data: {
        name,
        tier,
        monthlyBudget: Number(monthlyBudget),
        nextdoorBudget: Number(nextdoorBudget),
        googleBudget: Number(googleBudget),
        facebookBudget: Number(facebookBudget),
        otherBudget: Number(otherBudget),
        projectedLeads: Number(projectedLeads),
        projectedRevenue: Number(projectedRevenue),
        projectedROI: Number(projectedROI),
        active,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        userId
      }
    })

    res.json(plan)
  } catch (error) {
    console.error('Error creating budget plan:', error)
    res.status(500).json({ error: 'Failed to create budget plan' })
  }
})

// Get budget plans
router.get('/budget-plans', async (req, res) => {
  try {
    const { userId } = req.query

    const plans = await prisma.budgetPlan.findMany({
      where: userId ? { userId: userId as string } : undefined,
      orderBy: { createdAt: 'desc' }
    })

    res.json(plans)
  } catch (error) {
    console.error('Error fetching budget plans:', error)
    res.status(500).json({ error: 'Failed to fetch budget plans' })
  }
})

// Add lead activity
router.post('/leads/:id/activities', async (req, res) => {
  try {
    const { id } = req.params
    const { activityType, description, notes, userId } = req.body

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: id,
        activityType,
        description,
        notes,
        userId
      }
    })

    res.json(activity)
  } catch (error) {
    console.error('Error creating lead activity:', error)
    res.status(500).json({ error: 'Failed to create activity' })
  }
})

// Get lead activities
router.get('/leads/:id/activities', async (req, res) => {
  try {
    const { id } = req.params

    const activities = await prisma.leadActivity.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' }
    })

    res.json(activities)
  } catch (error) {
    console.error('Error fetching lead activities:', error)
    res.status(500).json({ error: 'Failed to fetch activities' })
  }
})

// Helper function to update neighborhood statistics
async function updateNeighborhoodStats(neighborhood: string, city: string, state: string) {
  try {
    // Get all leads for this neighborhood
    const leads = await prisma.lead.findMany({
      where: {
        neighborhood,
        city,
        state
      },
      include: {
        campaign: true
      }
    })

    const totalLeads = leads.length
    const wonLeads = leads.filter(l => l.status === 'WON')
    const totalRevenue = wonLeads.reduce((sum, l) => sum + Number(l.actualValue || 0), 0)
    
    // Calculate total spent from campaigns in this neighborhood
    const campaigns = await prisma.marketingCampaign.findMany({
      where: {
        targetArea: {
          has: neighborhood
        }
      }
    })
    
    const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.spent), 0)
    const avgCostPerLead = totalLeads > 0 ? totalSpent / totalLeads : 0
    const conversionRate = totalLeads > 0 ? (wonLeads.length / totalLeads) * 100 : 0
    const roi = totalSpent > 0 ? totalRevenue / totalSpent : 0

    // Upsert neighborhood performance
    await prisma.neighborhoodPerformance.upsert({
      where: {
        neighborhood_city_state: {
          neighborhood,
          city,
          state
        }
      },
      create: {
        neighborhood,
        city,
        state,
        totalLeads,
        totalCampaigns: campaigns.length,
        totalSpent,
        totalRevenue,
        avgCostPerLead,
        conversionRate,
        roi
      },
      update: {
        totalLeads,
        totalCampaigns: campaigns.length,
        totalSpent,
        totalRevenue,
        avgCostPerLead,
        conversionRate,
        roi,
        lastUpdated: new Date()
      }
    })
  } catch (error) {
    console.error('Error updating neighborhood stats:', error)
  }
}

export default router
