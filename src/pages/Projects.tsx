import { useQuery } from '@tanstack/react-query'
import { Plus, MapPin, Calendar } from 'lucide-react'

export default function Projects() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    },
    retry: 1
  })

  const statusColors: Record<string, string> = {
    PLANNING: 'bg-gray-100 text-gray-800',
    ESTIMATING: 'bg-blue-100 text-blue-800',
    APPROVED: 'bg-green-100 text-green-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-purple-100 text-purple-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eagle-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  const demoProjects = [
    { id: '1', name: 'Green Valley Homes', description: 'Sustainable residential development with solar-ready infrastructure', address: '123 Valley Rd, Austin, TX', status: 'IN_PROGRESS', type: 'GREEN_BUILD', createdAt: new Date().toISOString(), _count: { estimates: 4 } },
    { id: '2', name: 'Solar Ridge Estates', description: '12-unit townhome development with integrated solar panels', address: '456 Ridge Ave, Denver, CO', status: 'PLANNING', type: 'SOLAR_READY', createdAt: new Date().toISOString(), _count: { estimates: 3 } },
    { id: '3', name: 'Eco Commons', description: 'Mixed-use development featuring green building materials', address: '789 Commons Blvd, Portland, OR', status: 'ESTIMATING', type: 'GREEN_BUILD', createdAt: new Date().toISOString(), _count: { estimates: 2 } },
    { id: '4', name: 'Riverside Development', description: 'Luxury single-family homes with energy-efficient design', address: '321 River Ln, Seattle, WA', status: 'APPROVED', type: 'SINGLE_FAMILY', createdAt: new Date().toISOString(), _count: { estimates: 5 } },
    { id: '5', name: 'Mountain View Spec', description: 'High-performance spec home with modular construction', address: '654 Mountain Dr, Boulder, CO', status: 'IN_PROGRESS', type: 'SINGLE_FAMILY', createdAt: new Date().toISOString(), _count: { estimates: 1 } },
    { id: '6', name: 'Urban Renewal Project', description: 'Commercial renovation with sustainable upgrades', address: '987 Urban St, San Francisco, CA', status: 'PLANNING', type: 'RENOVATION', createdAt: new Date().toISOString(), _count: { estimates: 3 } }
  ]

  const displayProjects = error || !projects ? demoProjects : projects

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <button className="flex items-center gap-2 bg-eagle-blue text-white px-4 py-2 rounded-lg hover:bg-eagle-blue/90">
            <Plus className="h-5 w-5" />
            New Project
          </button>
        </div>
        {(error || !projects) && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="text-sm text-blue-800">
              📊 <strong>Demo Mode:</strong> Showing sample projects. Connect PostgreSQL database to manage real projects.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProjects.map((project: any) => (
          <div key={project.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[project.status]}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-2 mb-4">
                {project.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{project.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimates</span>
                  <span className="font-semibold text-gray-900">{project._count.estimates}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
