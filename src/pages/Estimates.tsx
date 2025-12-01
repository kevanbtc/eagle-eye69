import { useQuery } from '@tanstack/react-query'
import { Download, Plus, FileSpreadsheet } from 'lucide-react'

export default function Estimates() {
  const { data: estimates, isLoading, error } = useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      const res = await fetch('/api/estimates')
      if (!res.ok) throw new Error('Failed to fetch estimates')
      return res.json()
    },
    retry: 1
  })

  const handleExport = async (estimateId: string) => {
    try {
      const res = await fetch(`/api/exports/estimate/${estimateId}/excel`, {
        method: 'POST'
      })
      const data = await res.json()
      
      // Trigger download
      window.location.href = `/api/exports/download/${data.fileName}`
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eagle-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading estimates...</p>
        </div>
      </div>
    )
  }

  const demoEstimates = [
    { id: '1', name: 'Green Valley Phase 1', version: 1, project: { name: 'Green Valley Homes' }, totalCost: '285000', _count: { lineItems: 45 }, status: 'APPROVED' },
    { id: '2', name: 'Solar Panel Installation', version: 2, project: { name: 'Solar Ridge Estates' }, totalCost: '45000', _count: { lineItems: 12 }, status: 'DRAFT' },
    { id: '3', name: 'Foundation & Framing', version: 1, project: { name: 'Eco Commons' }, totalCost: '120000', _count: { lineItems: 28 }, status: 'UNDER_REVIEW' },
    { id: '4', name: 'Full Build Estimate', version: 3, project: { name: 'Riverside Development' }, totalCost: '425000', _count: { lineItems: 67 }, status: 'APPROVED' },
    { id: '5', name: 'Material Takeoff', version: 1, project: { name: 'Mountain View Spec' }, totalCost: '35000', _count: { lineItems: 15 }, status: 'DRAFT' },
    { id: '6', name: 'Renovation Estimate', version: 2, project: { name: 'Urban Renewal Project' }, totalCost: '185000', _count: { lineItems: 38 }, status: 'SENT_TO_CLIENT' }
  ]

  const displayEstimates = error || !estimates ? demoEstimates : estimates

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Estimates</h1>
          <button className="flex items-center gap-2 bg-eagle-blue text-white px-4 py-2 rounded-lg hover:bg-eagle-blue/90">
            <Plus className="h-5 w-5" />
            New Estimate
          </button>
        </div>
        {(error || !estimates) && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="text-sm text-blue-800">
              📊 <strong>Demo Mode:</strong> Sample estimates shown. Export to Excel will work once database is connected.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Line Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayEstimates.map((estimate: any) => (
              <tr key={estimate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{estimate.name}</div>
                      <div className="text-xs text-gray-500">v{estimate.version}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {estimate.project?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${parseFloat(estimate.totalCost).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {estimate._count.lineItems} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                    {estimate.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleExport(estimate.id)}
                    className="flex items-center gap-1 text-eagle-blue hover:text-eagle-blue/80"
                  >
                    <Download className="h-4 w-4" />
                    Excel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
