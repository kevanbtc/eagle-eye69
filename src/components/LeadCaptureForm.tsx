import { useState } from 'react'
import { Phone, Mail, MapPin, Home, CheckCircle, Loader } from 'lucide-react'

const SERVICES = [
  'Roof Repair/Replacement',
  'Storm Damage Repair',
  'Siding Installation',
  'Gutter Repair/Replacement',
  'Kitchen Remodeling',
  'Bathroom Remodeling',
  'Attic Insulation',
  'Winterization/Pipe Protection',
  'Energy Efficiency Upgrades',
  'Green/Solar Construction',
  'New Construction',
  'General Repairs',
  'Other'
]

const NE_ATLANTA_NEIGHBORHOODS = [
  'Medlock Bridge',
  'Abbotts Bridge',
  'Seven Oaks',
  'St. Ives',
  'St. Marlo',
  'Rivermont',
  'Newtown',
  'Cambridge',
  'Windward',
  'Country Club of the South',
  'Kimball Bridge',
  'Avalon',
  'Crooked Creek',
  'North Point',
  'Sugarloaf Country Club',
  'Howell Springs',
  'Cardinal Lake',
  'Riverfield',
  'Amberfield',
  'Peachtree Station',
  'Georgetown',
  'Dunwoody Village',
  'Other'
]

interface Props {
  source?: string // Where the lead came from (NEXTDOOR, GOOGLE_LSA, FACEBOOK, etc.)
  campaignId?: string // Specific campaign ID if from an ad
}

export default function LeadCaptureForm({ source = 'ORGANIC', campaignId }: Props) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Johns Creek',
    zipCode: '',
    neighborhood: '',
    serviceInterest: [] as string[],
    estimatedBudget: '',
    urgency: 'MEDIUM',
    notes: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleServiceToggle = (service: string) => {
    setFormData({
      ...formData,
      serviceInterest: formData.serviceInterest.includes(service)
        ? formData.serviceInterest.filter(s => s !== service)
        : [...formData.serviceInterest, service]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/marketing/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: 'GA',
          zipCode: formData.zipCode,
          neighborhood: formData.neighborhood,
          source,
          sourceNeighborhood: formData.neighborhood,
          campaignId,
          serviceInterest: formData.serviceInterest,
          estimatedValue: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : null,
          priority: formData.urgency,
          notes: formData.notes,
          userId: 'system' // Will be assigned to appropriate user by backend
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      setSubmitted(true)
    } catch (err) {
      setError('Failed to submit form. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-6">
            We've received your request and will contact you within 24 hours.
          </p>
          <div className="bg-eagle-blue/10 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-2">
              <strong>Need immediate assistance?</strong>
            </p>
            <p className="text-2xl font-bold text-eagle-blue mb-1">(470) 555-EAGLE</p>
            <p className="text-sm text-gray-600">Monday - Saturday: 7am - 7pm</p>
          </div>
          <p className="text-sm text-gray-500">
            Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-eagle-blue to-blue-700 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Get Your Free Estimate</h1>
          <p className="text-blue-100">
            Licensed • Insured • Serving NE Atlanta
          </p>
          {source !== 'ORGANIC' && (
            <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-full text-sm">
              Special offer from {source.replace('_', ' ')}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
                placeholder="John"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
                placeholder="Smith"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
                placeholder="(470) 555-1234"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Home className="w-4 h-4 inline mr-1" />
                Property Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
              >
                <option value="Johns Creek">Johns Creek</option>
                <option value="Alpharetta">Alpharetta</option>
                <option value="Duluth">Duluth</option>
                <option value="Peachtree Corners">Peachtree Corners</option>
                <option value="Dunwoody">Dunwoody</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Zip Code *
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
                placeholder="30097"
              />
            </div>

            {/* Neighborhood */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Neighborhood
              </label>
              <select
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
              >
                <option value="">Select your neighborhood...</option>
                {NE_ATLANTA_NEIGHBORHOODS.map(hood => (
                  <option key={hood} value={hood}>{hood}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Services Interested In */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What services are you interested in? *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SERVICES.map(service => (
                <label
                  key={service}
                  className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.serviceInterest.includes(service)
                      ? 'border-eagle-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.serviceInterest.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="w-5 h-5 text-eagle-blue rounded focus:ring-eagle-blue"
                  />
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget & Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Budget
              </label>
              <select
                name="estimatedBudget"
                value={formData.estimatedBudget}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
              >
                <option value="">Select a range...</option>
                <option value="2500">Under $5,000</option>
                <option value="7500">$5,000 - $10,000</option>
                <option value="15000">$10,000 - $20,000</option>
                <option value="30000">$20,000 - $40,000</option>
                <option value="60000">$40,000 - $80,000</option>
                <option value="100000">$80,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How soon do you need this done?
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
              >
                <option value="LOW">Just exploring (3+ months)</option>
                <option value="MEDIUM">Planning ahead (1-3 months)</option>
                <option value="HIGH">Ready to start (2-4 weeks)</option>
                <option value="URGENT">Urgent/Emergency (ASAP)</option>
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eagle-blue focus:border-transparent"
              placeholder="Tell us more about your project..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || formData.serviceInterest.length === 0}
            className="w-full bg-eagle-blue text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Get Your Free Estimate
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            By submitting this form, you agree to be contacted by Eagle Eye General Contractor.
            We respect your privacy and never share your information.
          </p>
        </form>
      </div>
    </div>
  )
}
