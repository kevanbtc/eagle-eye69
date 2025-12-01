import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Sparkles, Image as ImageIcon, Upload, Wand2, Grid3x3, Download, Eye } from 'lucide-react';

export default function AIImagery() {
  const [view, setView] = useState<'generate' | 'remodel' | 'gallery'>('generate');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [room, setRoom] = useState('');
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Demo gallery images
  const demoGallery = [
    { id: '1', imageUrl: 'https://placehold.co/400x400/4F46E5/white?text=Modern+Kitchen', prompt: 'Modern kitchen remodel with white cabinets and quartz countertops', style: 'modern', imageType: 'REMODEL_CONCEPT' },
    { id: '2', imageUrl: 'https://placehold.co/400x400/059669/white?text=Green+Living+Room', prompt: 'Eco-friendly living room with bamboo flooring and solar shading', style: 'sustainable', imageType: 'REMODEL_CONCEPT' },
    { id: '3', imageUrl: 'https://placehold.co/400x400/DC2626/white?text=Luxury+Bathroom', prompt: 'Spa-like bathroom with marble tiles and rainfall shower', style: 'luxury', imageType: 'INTERIOR_VIEW' },
    { id: '4', imageUrl: 'https://placehold.co/400x400/7C3AED/white?text=Open+Floor+Plan', prompt: 'Open concept floor plan with great room and island kitchen', style: 'modern', imageType: 'FLOOR_PLAN' },
    { id: '5', imageUrl: 'https://placehold.co/400x400/EA580C/white?text=Solar+Ready+Roof', prompt: 'Residential roof with integrated solar panel mounting system', style: 'sustainable', imageType: 'EXTERIOR_VIEW' },
    { id: '6', imageUrl: 'https://placehold.co/400x400/0891B2/white?text=Before+After', prompt: 'Dated kitchen transformed into modern culinary space', style: 'modern', imageType: 'BEFORE_AFTER' }
  ];

  const generateImage = useMutation({
    mutationFn: async (data: any) => {
      setLoading(true);
      const res = await fetch('/api/imagery/generate-remodel-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Generation failed');
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedImages(prev => [data, ...prev]);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
      alert('Image generation failed. Using demo mode.');
    }
  });

  const handleGenerate = () => {
    if (!prompt && !room) {
      alert('Please enter a description or room type');
      return;
    }

    generateImage.mutate({
      description: prompt,
      style,
      room,
      budget: 'medium',
      userId: 'demo-user',
      projectId: null
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Imagery & Remodeling</h1>
        <p className="text-gray-600">Generate photorealistic renderings, remodel concepts, and design variations with AI</p>
      </div>

      {/* View Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setView('generate')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              view === 'generate'
                ? 'border-eagle-blue text-eagle-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles className="inline h-5 w-5 mr-2" />
            Generate New
          </button>
          <button
            onClick={() => setView('remodel')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              view === 'remodel'
                ? 'border-eagle-blue text-eagle-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Wand2 className="inline h-5 w-5 mr-2" />
            Remodel Existing
          </button>
          <button
            onClick={() => setView('gallery')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              view === 'gallery'
                ? 'border-eagle-blue text-eagle-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid3x3 className="inline h-5 w-5 mr-2" />
            Gallery
          </button>
        </nav>
      </div>

      {/* Generate New View */}
      {view === 'generate' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Generate Design Concept</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue"
                >
                  <option value="">Select room...</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="bathroom">Bathroom</option>
                  <option value="living room">Living Room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="office">Home Office</option>
                  <option value="basement">Basement</option>
                  <option value="outdoor space">Outdoor Space</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Design Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['modern', 'traditional', 'industrial', 'farmhouse', 'coastal', 'minimalist', 'luxury', 'sustainable'].map(s => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`px-4 py-2 rounded-lg border-2 capitalize ${
                        style === s
                          ? 'border-eagle-blue bg-blue-50 text-eagle-blue'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision... (e.g., 'modern kitchen with island, white cabinets, quartz countertops, stainless appliances')"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3 bg-eagle-blue text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Results */}
          {generatedImages.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Generated Designs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((img) => (
                  <div key={img.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    <img src={img.imageUrl} alt={img.prompt} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2">{img.prompt}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                          <Download className="inline h-4 w-4 mr-1" />
                          Save
                        </button>
                        <button className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                          <Eye className="inline h-4 w-4 mr-1" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Remodel Existing View */}
      {view === 'remodel' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Transform Existing Space</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload photo of current space</p>
              <p className="text-sm text-gray-500">Supports JPG, PNG up to 10MB</p>
              <button className="mt-4 px-6 py-2 bg-eagle-blue text-white rounded-lg hover:bg-blue-700">
                Choose File
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remodeling Goals</label>
              <textarea
                placeholder="What would you like to change? (e.g., 'update cabinets, add island, new flooring')"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue"
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>AI Vision:</strong> Upload a photo and AI will analyze the space, suggest improvements, and generate photorealistic before/after renderings.
              </p>
            </div>

            <button className="w-full flex items-center justify-center px-6 py-3 bg-eagle-blue text-white rounded-lg hover:bg-blue-700">
              <Wand2 className="h-5 w-5 mr-2" />
              Generate Before/After
            </button>
          </div>
        </div>
      )}

      {/* Gallery View */}
      {view === 'gallery' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Design Gallery</h2>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>All Types</option>
              <option>Remodel Concepts</option>
              <option>Before/After</option>
              <option>Floor Plans</option>
              <option>Exterior Views</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoGallery.map((img) => (
              <div key={img.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group">
                <div className="relative">
                  <img src={img.imageUrl} alt={img.prompt} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-900 rounded-lg">
                      View Details
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full mb-2">
                    {img.imageType.replace('_', ' ')}
                  </span>
                  <p className="text-sm text-gray-600 mb-3">{img.prompt}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1 text-sm bg-eagle-blue text-white rounded hover:bg-blue-700">
                      Use in Project
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      <Download className="inline h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
