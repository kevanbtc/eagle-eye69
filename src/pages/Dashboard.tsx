import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, Home, FileText, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    },
    retry: 1,
    retryDelay: 1000
  })

  const { data: estimates, isLoading: estimatesLoading, error: estimatesError } = useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      const res = await fetch('/api/estimates')
      if (!res.ok) throw new Error('Failed to fetch estimates')
      return res.json()
    },
    retry: 1,
    retryDelay: 1000
  })

  if (projectsLoading || estimatesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eagle-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Use demo data if API fails
  const hasData = projects && estimates && !projectsError && !estimatesError
  
  const stats = [
    {
      name: 'Active Projects',
      value: hasData ? projects.filter((p: any) => p.status === 'IN_PROGRESS').length : 3,
      icon: Home,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Estimates',
      value: hasData ? estimates.length : 12,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      name: 'Est. Value',
      value: hasData ? `$${((estimates.reduce((sum: number, e: any) => sum + parseFloat(e.totalCost || 0), 0)) / 1000).toFixed(0)}K` : '$450K',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      name: 'Avg. Margin',
      value: '18%',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  const chartData = hasData && projects?.length > 0
    ? projects.slice(0, 6).map((p: any) => ({
        name: p.name.substring(0, 20),
        estimates: p._count?.estimates || 0
      }))
    : [
        { name: 'Green Valley Homes', estimates: 4 },
        { name: 'Solar Ridge Estates', estimates: 3 },
        { name: 'Eco Commons', estimates: 2 },
        { name: 'Riverside Development', estimates: 5 },
        { name: 'Mountain View Spec', estimates: 1 },
        { name: 'Urban Renewal Project', estimates: 3 }
      ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Estimates by Project</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="estimates" fill="#1e3a8a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Estimates</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {!hasData && (
            <div className="px-6 py-4 bg-blue-50 border-l-4 border-blue-500">
              <p className="text-sm text-blue-800">
                📊 <strong>Demo Mode:</strong> Connect database to see real data. These are sample estimates.
              </p>
            </div>
          )}
          {(hasData && estimates?.length > 0 ? estimates.slice(0, 5) : [
            { id: '1', name: 'Green Valley Phase 1', project: { name: 'Green Valley Homes' }, totalCost: '285000', status: 'APPROVED' },
            { id: '2', name: 'Solar Panel Install', project: { name: 'Solar Ridge Estates' }, totalCost: '45000', status: 'DRAFT' },
            { id: '3', name: 'Foundation & Framing', project: { name: 'Eco Commons' }, totalCost: '120000', status: 'UNDER_REVIEW' },
            { id: '4', name: 'Full Build Estimate', project: { name: 'Riverside Development' }, totalCost: '425000', status: 'APPROVED' },
            { id: '5', name: 'Material Takeoff', project: { name: 'Mountain View Spec' }, totalCost: '35000', status: 'DRAFT' }
          ]).map((estimate: any) => (
            <div key={estimate.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{estimate.name}</p>
                <p className="text-sm text-gray-600">{estimate.project?.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${parseFloat(estimate.totalCost).toLocaleString()}</p>
                <p className="text-sm text-gray-600">{estimate.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
