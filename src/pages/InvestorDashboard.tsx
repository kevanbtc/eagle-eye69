import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { DollarSign, TrendingUp, Home, Percent } from 'lucide-react'

export default function InvestorDashboard() {
  const { data: projects, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    retry: 1
  })

  const { data: estimates, error: estimatesError } = useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      const res = await fetch('/api/estimates')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    retry: 1
  })

  const demoProjects = [
    { id: '1', name: 'Green Valley Homes', type: 'GREEN_BUILD', status: 'IN_PROGRESS', createdAt: new Date().toISOString(), _count: { estimates: 4 } },
    { id: '2', name: 'Solar Ridge Estates', type: 'SOLAR_READY', status: 'PLANNING', createdAt: new Date().toISOString(), _count: { estimates: 3 } },
    { id: '3', name: 'Eco Commons', type: 'GREEN_BUILD', status: 'IN_PROGRESS', createdAt: new Date().toISOString(), _count: { estimates: 2 } },
    { id: '4', name: 'Riverside Development', type: 'SINGLE_FAMILY', status: 'COMPLETED', createdAt: new Date().toISOString(), _count: { estimates: 5 } },
    { id: '5', name: 'Mountain View Spec', type: 'SINGLE_FAMILY', status: 'IN_PROGRESS', createdAt: new Date().toISOString(), _count: { estimates: 1 } },
    { id: '6', name: 'Urban Renewal', type: 'RENOVATION', status: 'PLANNING', createdAt: new Date().toISOString(), _count: { estimates: 3 } }
  ]

  const demoEstimates = [
    { totalCost: '285000', markupPercent: '18' },
    { totalCost: '45000', markupPercent: '22' },
    { totalCost: '120000', markupPercent: '15' },
    { totalCost: '425000', markupPercent: '20' },
    { totalCost: '35000', markupPercent: '25' },
    { totalCost: '185000', markupPercent: '17' }
  ]

  const displayProjects = projectsError || !projects ? demoProjects : projects
  const displayEstimates = estimatesError || !estimates ? demoEstimates : estimates

  // Calculate metrics
  const totalValue = displayEstimates.reduce((sum: number, e: any) => sum + parseFloat(e.totalCost || 0), 0)
  const avgMargin = displayEstimates.reduce((sum: number, e: any) => sum + parseFloat(e.markupPercent || 0), 0) / displayEstimates.length
  const completedProjects = displayProjects.filter((p: any) => p.status === 'COMPLETED').length
  const activeProjects = displayProjects.filter((p: any) => p.status === 'IN_PROGRESS').length

  // Project status distribution
  const statusData = [
    { name: 'Planning', value: displayProjects.filter((p: any) => p.status === 'PLANNING').length },
    { name: 'In Progress', value: activeProjects },
    { name: 'Completed', value: completedProjects }
  ]

  // Project type distribution
  const typeData = displayProjects.reduce((acc: any, p: any) => {
    const existing = acc.find((item: any) => item.name === p.type)
    if (existing) {
      existing.value++
    } else {
      acc.push({ name: p.type.replace('_', ' '), value: 1 })
    }
    return acc
  }, []) || []

  const COLORS = ['#1e3a8a', '#059669', '#f59e0b', '#8b5cf6']

  const investorStats = [
    {
      name: 'Total Portfolio Value',
      value: `$${(totalValue / 1000000).toFixed(2)}M`,
      icon: DollarSign,
      color: 'bg-blue-500',
      change: '+12.5%'
    },
    {
      name: 'Active Projects',
      value: activeProjects,
      icon: Home,
      color: 'bg-green-500',
      change: '+3'
    },
    {
      name: 'Avg. Profit Margin',
      value: `${avgMargin.toFixed(1)}%`,
      icon: Percent,
      color: 'bg-purple-500',
      change: '+2.3%'
    },
    {
      name: 'ROI',
      value: '24.8%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5.1%'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Investor Dashboard</h1>
        {(projectsError || estimatesError) && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-blue-800">
              📊 <strong>Demo Mode:</strong> Showing sample portfolio analytics. Connect database for live investor metrics.
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {investorStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Project Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Project Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Projects by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1e3a8a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayProjects.slice(0, 8).map((project: any) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {project.type.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                      {project.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {project._count.estimates}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
