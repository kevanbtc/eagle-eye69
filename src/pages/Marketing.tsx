import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users, 
  MapPin,
  Eye,
  MousePointer,
  PhoneCall,
  Award,
  BarChart3,
  PieChart,
  Calendar,
  Plus
} from 'lucide-react'

interface MarketingStats {
  totalSpent: number
  totalRevenue: number
  totalLeads: number
  totalConversions: number
  roi: number
  avgCostPerLead: number
  conversionRate: number
  activeCampaigns: number
}

interface Campaign {
  id: string
  name: string
  platform: string
  campaignType: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  leads: number
  conversions: number
  revenue: number
  status: string
  startDate: string
  targetArea: string[]
}

interface NeighborhoodStats {
  neighborhood: string
  city: string
  totalLeads: number
  totalSpent: number
  totalRevenue: number
  avgCostPerLead: number
  conversionRate: number
  roi: number
}

interface Lead {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  neighborhood?: string
  source: string
  serviceInterest: string[]
  status: string
  estimatedValue?: number
  createdAt: string
}

const NE_ATLANTA_NEIGHBORHOODS = [
  // Johns Creek
  { name: 'Medlock Bridge', city: 'Johns Creek' },
  { name: 'Abbotts Bridge', city: 'Johns Creek' },
  { name: 'Seven Oaks', city: 'Johns Creek' },
  { name: 'St. Ives', city: 'Johns Creek' },
  { name: 'St. Marlo', city: 'Johns Creek' },
  { name: 'Rivermont', city: 'Johns Creek' },
  { name: 'Newtown', city: 'Johns Creek' },
  { name: 'Cambridge', city: 'Johns Creek' },
  
  // Alpharetta
  { name: 'Windward', city: 'Alpharetta' },
  { name: 'Country Club of the South', city: 'Alpharetta' },
  { name: 'Kimball Bridge', city: 'Alpharetta' },
  { name: 'Avalon', city: 'Alpharetta' },
  { name: 'Crooked Creek', city: 'Alpharetta' },
  { name: 'North Point', city: 'Alpharetta' },
  
  // Duluth
  { name: 'Sugarloaf Country Club', city: 'Duluth' },
  { name: 'Howell Springs', city: 'Duluth' },
  { name: 'Cardinal Lake', city: 'Duluth' },
  
  // Peachtree Corners
  { name: 'Riverfield', city: 'Peachtree Corners' },
  { name: 'Amberfield', city: 'Peachtree Corners' },
  { name: 'Peachtree Station', city: 'Peachtree Corners' },
  
  // Dunwoody
  { name: 'Georgetown', city: 'Dunwoody' },
  { name: 'Dunwoody Village', city: 'Dunwoody' },
]

export default function Marketing() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'leads' | 'neighborhoods'>('overview')
  const [showNewCampaign, setShowNewCampaign] = useState(false)

  // Fetch marketing stats
  const { data: stats } = useQuery<MarketingStats>({
    queryKey: ['marketingStats'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/marketing/stats')
      return response.json()
    }
  })

  // Fetch campaigns
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/marketing/campaigns')
      return response.json()
    }
  })

  // Fetch neighborhood performance
  const { data: neighborhoods = [] } = useQuery<NeighborhoodStats[]>({
    queryKey: ['neighborhoodPerformance'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/marketing/neighborhoods')
      return response.json()
    }
  })

  // Fetch leads
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/marketing/leads')
      return response.json()
    }
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      PAUSED: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      DRAFT: 'bg-gray-100 text-gray-800',
      NEW: 'bg-blue-100 text-blue-800',
      CONTACTED: 'bg-purple-100 text-purple-800',
      QUALIFIED: 'bg-indigo-100 text-indigo-800',
      QUOTE_SENT: 'bg-orange-100 text-orange-800',
      WON: 'bg-green-100 text-green-800',
      LOST: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      NEXTDOOR: 'bg-green-500',
      GOOGLE_LSA: 'bg-blue-500',
      GOOGLE_ADS: 'bg-red-500',
      FACEBOOK: 'bg-blue-600',
      INSTAGRAM: 'bg-pink-500',
      ANGI: 'bg-orange-500',
      REFERRAL: 'bg-purple-500',
      ORGANIC: 'bg-emerald-500'
    }
    return colors[platform] || 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Hub</h1>
          <p className="text-gray-600 mt-1">NE Atlanta Lead Generation & Campaign Management</p>
        </div>
        <button
          onClick={() => setShowNewCampaign(true)}
          className="flex items-center gap-2 px-4 py-2 bg-eagle-blue text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          New Campaign
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats?.totalSpent.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${stats?.totalRevenue.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalLeads || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ${stats?.avgCostPerLead.toFixed(2) || '0'} / lead
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">ROI</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {stats?.roi.toFixed(1) || '0'}x
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.conversionRate.toFixed(1) || '0'}% conversion
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'campaigns', label: 'Campaigns', icon: Target },
              { id: 'leads', label: 'Leads', icon: PhoneCall },
              { id: 'neighborhoods', label: 'Neighborhoods', icon: MapPin }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-eagle-blue text-eagle-blue'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Performance */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
                  <div className="space-y-3">
                    {['NEXTDOOR', 'GOOGLE_LSA', 'FACEBOOK', 'REFERRAL'].map(platform => {
                      const platformCampaigns = campaigns.filter(c => c.platform === platform)
                      const totalLeads = platformCampaigns.reduce((sum, c) => sum + c.leads, 0)
                      const totalSpent = platformCampaigns.reduce((sum, c) => sum + c.spent, 0)
                      
                      return (
                        <div key={platform} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getPlatformColor(platform)}`} />
                            <span className="font-medium">{platform.replace('_', ' ')}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{totalLeads} leads</p>
                            <p className="text-sm text-gray-600">${totalSpent.toLocaleString()}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Leads</h3>
                  <div className="space-y-3">
                    {leads.slice(0, 5).map(lead => (
                      <div key={lead.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                          <p className="text-sm text-gray-600">{lead.neighborhood || 'Unknown'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{lead.source.replace('_', ' ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Neighborhoods */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Top Performing Neighborhoods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {neighborhoods.slice(0, 6).map(hood => (
                    <div key={`${hood.neighborhood}-${hood.city}`} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{hood.neighborhood}</h4>
                          <p className="text-sm text-gray-600">{hood.city}</p>
                        </div>
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <p className="text-xs text-gray-600">Leads</p>
                          <p className="font-semibold">{hood.totalLeads}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">ROI</p>
                          <p className="font-semibold text-green-600">{hood.roi.toFixed(1)}x</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Conv Rate</p>
                          <p className="font-semibold">{hood.conversionRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Cost/Lead</p>
                          <p className="font-semibold">${hood.avgCostPerLead.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Active Campaigns</h3>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>All Platforms</option>
                    <option>Nextdoor</option>
                    <option>Google LSA</option>
                    <option>Facebook</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{campaign.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPlatformColor(campaign.platform)}`}>
                            {campaign.platform.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(campaign.startDate).toLocaleDateString()}
                          </span>
                          <span>{campaign.targetArea.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Budget</p>
                        <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Spent</p>
                        <p className="font-semibold text-red-600">${campaign.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Impressions
                        </p>
                        <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <MousePointer className="w-3 h-3" /> Clicks
                        </p>
                        <p className="font-semibold">{campaign.clicks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" /> Leads
                        </p>
                        <p className="font-semibold text-blue-600">{campaign.leads}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Revenue</p>
                        <p className="font-semibold text-green-600">${campaign.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">All Leads</h3>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>All Status</option>
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                    <option>Quote Sent</option>
                    <option>Won</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>All Sources</option>
                    <option>Nextdoor</option>
                    <option>Google LSA</option>
                    <option>Facebook</option>
                    <option>Referral</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Neighborhood</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Source</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Service</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Value</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{lead.phone}</p>
                          {lead.email && <p className="text-xs text-gray-500">{lead.email}</p>}
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{lead.neighborhood || 'N/A'}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPlatformColor(lead.source)}`}>
                            {lead.source.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{lead.serviceInterest.join(', ')}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold">${lead.estimatedValue?.toLocaleString() || 'TBD'}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Neighborhoods Tab */}
          {activeTab === 'neighborhoods' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">NE Atlanta Neighborhood Performance</h3>
                <p className="text-sm text-gray-600">
                  Track ROI and lead generation across Johns Creek, Alpharetta, Duluth, Peachtree Corners & Dunwoody
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {NE_ATLANTA_NEIGHBORHOODS.map(hood => {
                  const stats = neighborhoods.find(n => n.neighborhood === hood.name && n.city === hood.city)
                  
                  return (
                    <div key={`${hood.name}-${hood.city}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-eagle-blue transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{hood.name}</h4>
                          <p className="text-sm text-gray-600">{hood.city}, GA</p>
                        </div>
                        <MapPin className="w-5 h-5 text-eagle-blue" />
                      </div>

                      {stats ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-2 rounded">
                            <p className="text-xs text-gray-600">Total Leads</p>
                            <p className="text-lg font-bold text-gray-900">{stats.totalLeads}</p>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <p className="text-xs text-gray-600">ROI</p>
                            <p className="text-lg font-bold text-green-600">{stats.roi.toFixed(1)}x</p>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <p className="text-xs text-gray-600">Cost/Lead</p>
                            <p className="text-sm font-semibold">${stats.avgCostPerLead.toFixed(0)}</p>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <p className="text-xs text-gray-600">Conv Rate</p>
                            <p className="text-sm font-semibold">{stats.conversionRate.toFixed(1)}%</p>
                          </div>
                          <div className="bg-white p-2 rounded col-span-2">
                            <p className="text-xs text-gray-600">Total Revenue</p>
                            <p className="text-lg font-bold text-eagle-blue">${stats.totalRevenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">No campaigns yet</p>
                          <button className="mt-2 text-xs text-eagle-blue hover:underline">
                            Start Campaign
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
