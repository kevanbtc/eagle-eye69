import { useState } from 'react'
import { TrendingUp, DollarSign, Users, Award, Target } from 'lucide-react'

interface BudgetTier {
  name: string
  tier: 'LOW' | 'MEDIUM' | 'AGGRESSIVE'
  monthlyBudget: number
  breakdown: {
    nextdoor: number
    googleLSA: number
    facebook: number
    other: number
  }
  projections: {
    impressions: number
    clicks: number
    leads: number
    conversions: number
    revenue: number
    costPerLead: number
    roi: number
  }
  description: string
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    name: 'Starter Plan',
    tier: 'LOW',
    monthlyBudget: 300,
    breakdown: {
      nextdoor: 150,    // 2 Local Deals @ $75 each
      googleLSA: 100,   // ~3-4 leads
      facebook: 30,     // Brand awareness
      other: 20         // Misc/testing
    },
    projections: {
      impressions: 15000,
      clicks: 80,
      leads: 8,
      conversions: 2,
      revenue: 8000,
      costPerLead: 37.50,
      roi: 26.7
    },
    description: 'Perfect for testing the waters. Ideal for new contractors or seasonal campaigns.'
  },
  {
    name: 'Growth Plan',
    tier: 'MEDIUM',
    monthlyBudget: 1000,
    breakdown: {
      nextdoor: 300,    // 3 Local Deals
      googleLSA: 600,   // ~15-20 leads
      facebook: 80,     // Retargeting
      other: 20         // Testing
    },
    projections: {
      impressions: 45000,
      clicks: 250,
      leads: 20,
      conversions: 5,
      revenue: 20000,
      costPerLead: 50,
      roi: 20
    },
    description: 'Recommended for established contractors ready to scale. Balanced across platforms.'
  },
  {
    name: 'Dominate Plan',
    tier: 'AGGRESSIVE',
    monthlyBudget: 3000,
    breakdown: {
      nextdoor: 800,    // 6-8 Local Deals + sponsorships
      googleLSA: 1800,  // ~50+ leads
      facebook: 300,    // Full retargeting + lookalike
      other: 100        // Angi, Thumbtack, testing
    },
    projections: {
      impressions: 120000,
      clicks: 800,
      leads: 60,
      conversions: 15,
      revenue: 60000,
      costPerLead: 50,
      roi: 20
    },
    description: 'Maximum market dominance. Own all top neighborhoods in NE Atlanta.'
  }
]

interface Props {
  onSelectPlan?: (plan: BudgetTier) => void
}

export default function BudgetPlanner({ onSelectPlan }: Props) {
  const [selectedTier, setSelectedTier] = useState<BudgetTier>(BUDGET_TIERS[1])

  const handleSelectPlan = async (plan: BudgetTier) => {
    setSelectedTier(plan)
    
    if (onSelectPlan) {
      onSelectPlan(plan)
    }

    // Save to database
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await fetch('http://localhost:5000/api/marketing/budget-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: plan.name,
          tier: plan.tier,
          monthlyBudget: plan.monthlyBudget,
          nextdoorBudget: plan.breakdown.nextdoor,
          googleBudget: plan.breakdown.googleLSA,
          facebookBudget: plan.breakdown.facebook,
          otherBudget: plan.breakdown.other,
          projectedLeads: plan.projections.leads,
          projectedRevenue: plan.projections.revenue,
          projectedROI: plan.projections.roi,
          active: true,
          startDate: new Date(),
          userId: user.id
        })
      })
    } catch (error) {
      console.error('Error saving budget plan:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Marketing Budget</h2>
        <p className="text-gray-600">
          Data-driven budget plans optimized for NE Atlanta contractors
        </p>
      </div>

      {/* Budget Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BUDGET_TIERS.map((tier) => (
          <div
            key={tier.tier}
            className={`relative bg-white rounded-2xl shadow-lg p-6 border-2 transition-all cursor-pointer ${
              selectedTier.tier === tier.tier
                ? 'border-eagle-blue scale-105'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelectPlan(tier)}
          >
            {tier.tier === 'MEDIUM' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-eagle-blue text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Recommended
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-eagle-blue">
                  ${tier.monthlyBudget.toLocaleString()}
                </span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center mb-6 min-h-[60px]">
              {tier.description}
            </p>

            {/* Budget Breakdown */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Budget Allocation:</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nextdoor</span>
                  <span className="font-semibold">${tier.breakdown.nextdoor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Google LSA</span>
                  <span className="font-semibold">${tier.breakdown.googleLSA}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Facebook/Instagram</span>
                  <span className="font-semibold">${tier.breakdown.facebook}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Other Platforms</span>
                  <span className="font-semibold">${tier.breakdown.other}</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">Leads/Month</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{tier.projections.leads}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-gray-600">Cost/Lead</span>
                </div>
                <p className="text-xl font-bold text-gray-900">${tier.projections.costPerLead}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">Conversions</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{tier.projections.conversions}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-gray-600">ROI</span>
                </div>
                <p className="text-xl font-bold text-purple-600">{tier.projections.roi}x</p>
              </div>
            </div>

            {/* Revenue Projection */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Expected Monthly Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${tier.projections.revenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <button
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                selectedTier.tier === tier.tier
                  ? 'bg-eagle-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selectedTier.tier === tier.tier ? 'Selected Plan' : 'Select This Plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Selected Plan Details */}
      <div className="bg-gradient-to-r from-eagle-blue to-blue-700 rounded-2xl shadow-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Your Selected Plan: {selectedTier.name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Expected Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="opacity-90">Monthly Impressions:</span>
                <span className="font-bold">{selectedTier.projections.impressions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Total Clicks:</span>
                <span className="font-bold">{selectedTier.projections.clicks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">New Leads:</span>
                <span className="font-bold">{selectedTier.projections.leads}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Won Jobs:</span>
                <span className="font-bold">{selectedTier.projections.conversions}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Financial Projection</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="opacity-90">Total Investment:</span>
                <span className="font-bold">${selectedTier.monthlyBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Expected Revenue:</span>
                <span className="font-bold">${selectedTier.projections.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Net Profit:</span>
                <span className="font-bold">
                  ${(selectedTier.projections.revenue - selectedTier.monthlyBudget).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="opacity-90">Return on Investment:</span>
                <span className="font-bold">{selectedTier.projections.roi}x</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-sm opacity-90">
            💡 <strong>Pro Tip:</strong> Start with this plan for 30 days, track results in your Marketing Dashboard,
            then optimize based on which neighborhoods and platforms perform best for your business.
          </p>
        </div>
      </div>

      {/* Platform Strategy */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4">Platform Strategy Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <h4 className="font-semibold">Nextdoor (${selectedTier.breakdown.nextdoor}/mo)</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• Local Deals for roof inspections, winterization</li>
              <li>• Neighborhood sponsorships in top areas</li>
              <li>• Community engagement posts</li>
              <li>• Best for: Johns Creek, Alpharetta hyperlocal</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h4 className="font-semibold">Google LSA (${selectedTier.breakdown.googleLSA}/mo)</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• Pay-per-lead model (avg $25-40/lead)</li>
              <li>• Google Guaranteed badge</li>
              <li>• High-intent searchers</li>
              <li>• Best for: Storm damage, emergency repairs</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <h4 className="font-semibold">Facebook/Instagram (${selectedTier.breakdown.facebook}/mo)</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• Before/after visual content</li>
              <li>• Retargeting website visitors</li>
              <li>• Lookalike audiences</li>
              <li>• Best for: Brand awareness, green builds</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <h4 className="font-semibold">Other Platforms (${selectedTier.breakdown.other}/mo)</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• Angi/HomeAdvisor leads</li>
              <li>• Thumbtack quotes</li>
              <li>• Testing new channels</li>
              <li>• Best for: Diversification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
