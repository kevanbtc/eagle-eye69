import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, Phone, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Schedule() {
  const [view, setView] = useState<'appointments' | 'calls' | 'meetings'>('appointments');
  const [showNewForm, setShowNewForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch data
  const { data: appointments, isLoading: loadingAppts } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await fetch('/api/scheduling/appointments?userId=demo-user');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    retry: 1
  });

  const { data: calls, isLoading: loadingCalls } = useQuery({
    queryKey: ['calls'],
    queryFn: async () => {
      const res = await fetch('/api/scheduling/calls?userId=demo-user');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    retry: 1
  });

  const { data: meetings, isLoading: loadingMeetings } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const res = await fetch('/api/scheduling/meetings?userId=demo-user');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    retry: 1
  });

  // Demo data
  const demoAppointments = [
    { id: '1', title: 'Site Inspection - Green Valley', startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 90000000).toISOString(), location: '123 Valley Rd', status: 'SCHEDULED', attendees: ['John Smith', 'Contractor'] },
    { id: '2', title: 'Client Meeting - Solar Ridge', startTime: new Date(Date.now() + 172800000).toISOString(), endTime: new Date(Date.now() + 176400000).toISOString(), location: 'Office', status: 'CONFIRMED', attendees: ['Sarah Johnson'] },
    { id: '3', title: 'Material Delivery', startTime: new Date(Date.now() + 259200000).toISOString(), endTime: new Date(Date.now() + 262800000).toISOString(), location: 'Warehouse', status: 'SCHEDULED', attendees: [] }
  ];

  const demoCalls = [
    { id: '1', phoneNumber: '(555) 123-4567', direction: 'OUTBOUND', status: 'COMPLETED', duration: 420, notes: 'Discussed material pricing and delivery timeline', createdAt: new Date().toISOString() },
    { id: '2', phoneNumber: '(555) 987-6543', direction: 'INBOUND', status: 'SCHEDULED', scheduledAt: new Date(Date.now() + 43200000).toISOString(), notes: 'Follow-up on estimate approval' },
    { id: '3', phoneNumber: '(555) 456-7890', direction: 'OUTBOUND', status: 'MISSED', createdAt: new Date(Date.now() - 3600000).toISOString() }
  ];

  const demoMeetings = [
    { id: '1', title: 'Weekly Project Review', startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 93600000).toISOString(), attendees: ['Team Lead', 'Foreman', 'Project Manager'], status: 'SCHEDULED' },
    { id: '2', title: 'Budget Planning Session', startTime: new Date(Date.now() + 259200000).toISOString(), endTime: new Date(Date.now() + 270000000).toISOString(), attendees: ['CFO', 'Estimator'], status: 'SCHEDULED' }
  ];

  const displayAppointments = !appointments ? demoAppointments : appointments;
  const displayCalls = !calls ? demoCalls : calls;
  const displayMeetings = !meetings ? demoMeetings : meetings;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
      case 'MISSED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'SCHEDULED':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
      case 'MISSED':
        return 'bg-red-100 text-red-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loadingAppts || loadingCalls || loadingMeetings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eagle-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Coordination Hub</h1>
        {(!appointments || !calls || !meetings) && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-blue-800">
              🤖 <strong>Demo Mode:</strong> Showing sample scheduling data. Connect database for full AI coordination features.
            </p>
          </div>
        )}
      </div>

      {/* View Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setView('appointments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              view === 'appointments'
                ? 'border-eagle-blue text-eagle-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="inline h-5 w-5 mr-2" />
            Appointments
          </button>
          <button
            onClick={() => setView('calls')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              view === 'calls'
                ? 'border-eagle-blue text-eagle-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Phone className="inline h-5 w-5 mr-2" />
            Phone Calls
          </button>
          <button
            onClick={() => setView('meetings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              view === 'meetings'
                ? 'border-eagle-blue text-eagle-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="inline h-5 w-5 mr-2" />
            Meetings
          </button>
        </nav>
      </div>

      {/* Add New Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center px-4 py-2 bg-eagle-blue text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule with AI
        </button>
      </div>

      {/* Appointments View */}
      {view === 'appointments' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            <div className="space-y-4">
              {displayAppointments.map((appt: any) => (
                <div key={appt.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(appt.status)}
                        <h3 className="font-semibold text-gray-900">{appt.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appt.status)}`}>
                          {appt.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 {new Date(appt.startTime).toLocaleString()}</p>
                        {appt.location && <p>📍 {appt.location}</p>}
                        {appt.attendees && appt.attendees.length > 0 && (
                          <p>👥 {appt.attendees.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <button className="text-eagle-blue hover:text-blue-700 text-sm font-medium">
                      Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phone Calls View */}
      {view === 'calls' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Phone Call Log</h2>
            <div className="space-y-4">
              {displayCalls.map((call: any) => (
                <div key={call.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(call.status)}
                        <h3 className="font-semibold text-gray-900">{call.phoneNumber}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          call.direction === 'INBOUND' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {call.direction}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(call.status)}`}>
                          {call.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {call.duration && <p>⏱️ Duration: {Math.floor(call.duration / 60)}m {call.duration % 60}s</p>}
                        {call.scheduledAt && <p>📅 Scheduled: {new Date(call.scheduledAt).toLocaleString()}</p>}
                        {call.notes && <p className="text-gray-700 mt-2">📝 {call.notes}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Meetings View */}
      {view === 'meetings' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Scheduled Meetings</h2>
            <div className="space-y-4">
              {displayMeetings.map((meeting: any) => (
                <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(meeting.status)}
                        <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 {new Date(meeting.startTime).toLocaleString()}</p>
                        <p>⏰ Duration: {Math.round((new Date(meeting.endTime).getTime() - new Date(meeting.startTime).getTime()) / 60000)} minutes</p>
                        {meeting.attendees && meeting.attendees.length > 0 && (
                          <p>👥 Attendees: {meeting.attendees.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <button className="text-eagle-blue hover:text-blue-700 text-sm font-medium">
                      View Notes →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
