import { useQuery } from '@tanstack/react-query'
import { Leaf, Sun, Search } from 'lucide-react'
import { useState } from 'react'

export default function Materials() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGreen, setFilterGreen] = useState(false)
  const [filterSolar, setFilterSolar] = useState(false)

  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials', searchTerm, filterGreen, filterSolar],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filterGreen) params.append('isGreen', 'true')
      if (filterSolar) params.append('isSolar', 'true')
      
      const res = await fetch(`/api/materials?${params}`)
      if (!res.ok) throw new Error('Failed to fetch materials')
      return res.json()
    },
    retry: 1
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eagle-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading materials...</p>
        </div>
      </div>
    )
  }

  const demoMaterials = [
    { id: '1', name: 'Recycled Steel Framing', description: 'High-strength recycled steel beams for eco-friendly construction', category: 'Framing', baseCost: '4.50', unit: 'lf', supplier: 'GreenSteel Co', isGreen: true, isSolar: false, certifications: ['LEED', 'Energy Star'] },
    { id: '2', name: 'Solar-Ready Roofing Shingles', description: 'Integrated mounting system for easy solar panel installation', category: 'Roofing', baseCost: '2.85', unit: 'sf', supplier: 'SolarTop Systems', isGreen: true, isSolar: true, certifications: ['Energy Star', 'Solar Ready'] },
    { id: '3', name: 'Bamboo Flooring', description: 'Sustainable hardwood alternative with excellent durability', category: 'Finishes', baseCost: '6.75', unit: 'sf', supplier: 'EcoFloors Inc', isGreen: true, isSolar: false, certifications: ['FSC', 'LEED'] },
    { id: '4', name: 'Low-VOC Interior Paint', description: 'Zero-emission water-based paint for healthier indoor air', category: 'Finishes', baseCost: '38.50', unit: 'gal', supplier: 'GreenCoat Paints', isGreen: true, isSolar: false, certifications: ['Green Seal', 'LEED'] },
    { id: '5', name: 'Triple-Pane Windows', description: 'Energy-efficient windows with argon gas fill', category: 'Windows', baseCost: '425.00', unit: 'ea', supplier: 'ThermalView', isGreen: true, isSolar: false, certifications: ['Energy Star'] },
    { id: '6', name: 'Solar Panel Mounting Rails', description: 'Aluminum rails for photovoltaic panel installation', category: 'Solar', baseCost: '12.50', unit: 'lf', supplier: 'SunMount Pro', isGreen: false, isSolar: true, certifications: ['UL Listed'] },
    { id: '7', name: 'Cellulose Insulation', description: 'Recycled paper insulation with superior R-value', category: 'Insulation', baseCost: '1.35', unit: 'sf', supplier: 'GreenFiber Co', isGreen: true, isSolar: false, certifications: ['LEED', 'GreenGuard'] },
    { id: '8', name: 'LED Recessed Lighting', description: 'Energy-efficient 6-inch LED retrofit kit', category: 'Electrical', baseCost: '28.00', unit: 'ea', supplier: 'BrightGreen Electric', isGreen: true, isSolar: false, certifications: ['Energy Star'] },
    { id: '9', name: 'Rainwater Harvesting Tank', description: '500-gallon underground water collection system', category: 'Plumbing', baseCost: '850.00', unit: 'ea', supplier: 'AquaSave Systems', isGreen: true, isSolar: false, certifications: ['WaterSense'] },
    { id: '10', name: 'Modular Wall Panels', description: 'Pre-fabricated insulated wall sections for rapid assembly', category: 'Framing', baseCost: '45.00', unit: 'sf', supplier: 'ModBuild Inc', isGreen: true, isSolar: false, certifications: ['ICC Certified'] }
  ]

  let displayMaterials = error || !materials ? demoMaterials : materials
  
  // Apply filters to demo data
  if (error || !materials) {
    if (filterGreen) displayMaterials = displayMaterials.filter((m: any) => m.isGreen)
    if (filterSolar) displayMaterials = displayMaterials.filter((m: any) => m.isSolar)
    if (searchTerm) {
      displayMaterials = displayMaterials.filter((m: any) => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Materials Database</h1>
        {(error || !materials) && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-blue-800">
              🌱 <strong>Demo Mode:</strong> Showing sample green & solar-ready materials. Connect database for full catalog.
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterGreen(!filterGreen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                filterGreen
                  ? 'bg-eagle-green text-white border-eagle-green'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Leaf className="h-4 w-4" />
              Green
            </button>
            <button
              onClick={() => setFilterSolar(!filterSolar)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                filterSolar
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Sun className="h-4 w-4" />
              Solar
            </button>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayMaterials.map((material: any) => (
          <div key={material.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{material.name}</h3>
              <div className="flex gap-1">
                {material.isGreen && (
                  <Leaf className="h-5 w-5 text-eagle-green" />
                )}
                {material.isSolar && (
                  <Sun className="h-5 w-5 text-orange-500" />
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{material.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-gray-900">{material.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Cost</span>
                <span className="font-semibold text-gray-900">
                  ${parseFloat(material.baseCost).toFixed(2)} / {material.unit}
                </span>
              </div>
              {material.supplier && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Supplier</span>
                  <span className="text-gray-900">{material.supplier}</span>
                </div>
              )}
            </div>

            {material.certifications?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-1">
                  {material.certifications.map((cert: string) => (
                    <span
                      key={cert}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
