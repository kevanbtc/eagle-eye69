import { Router } from 'express';
import OpenAI from 'openai';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Apply authentication to all scheduling routes
router.use(authenticate);

// AI-powered appointment scheduling
router.post('/appointments/ai-schedule', async (req, res) => {
  try {
    const { projectId, description, preferredTimes, attendees, userId } = req.body;

    // Use AI to suggest optimal meeting times
    const prompt = `You are a construction project coordinator. Analyze this scheduling request:
- Project: ${projectId}
- Description: ${description}
- Preferred times: ${preferredTimes}
- Attendees: ${attendees?.join(', ')}

Suggest 3 optimal meeting times with reasoning. Return JSON:
{
  "suggestions": [
    {
      "startTime": "ISO 8601 datetime",
      "endTime": "ISO 8601 datetime",
      "reasoning": "why this time works"
    }
  ],
  "title": "suggested meeting title",
  "agenda": "suggested agenda"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    res.json(result);
  } catch (error) {
    console.error('AI scheduling error:', error);
    res.status(500).json({ error: 'Failed to generate schedule suggestions' });
  }
});

// Create appointment
router.post('/appointments', async (req, res) => {
  try {
    const { title, description, startTime, endTime, location, attendees, projectId, userId, aiGenerated } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        attendees: attendees || [],
        projectId,
        userId,
        aiGenerated: aiGenerated || false
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Appointment Scheduled',
        message: `${title} scheduled for ${new Date(startTime).toLocaleString()}`,
        type: 'APPOINTMENT_REMINDER',
        actionUrl: `/appointments/${appointment.id}`
      }
    });

    res.json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Get appointments
router.get('/appointments', async (req, res) => {
  try {
    const { userId, projectId, status } = req.query;
    const where: any = {};
    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      include: { project: true },
      orderBy: { startTime: 'asc' }
    });

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Update appointment
router.put('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.update({
      where: { id },
      data: req.body
    });
    res.json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Phone call management
router.post('/calls', async (req, res) => {
  try {
    const { phoneNumber, direction, projectId, userId, scheduledAt, notes } = req.body;

    const call = await prisma.phoneCall.create({
      data: {
        phoneNumber,
        direction,
        projectId,
        userId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes,
        status: scheduledAt ? 'SCHEDULED' : 'PENDING'
      }
    });

    res.json(call);
  } catch (error) {
    console.error('Create call error:', error);
    res.status(500).json({ error: 'Failed to create call record' });
  }
});

// AI call summary
router.post('/calls/:id/ai-summary', async (req, res) => {
  try {
    const { id } = req.params;
    const { transcript } = req.body;

    const prompt = `Summarize this construction-related phone call transcript:

${transcript}

Provide JSON with:
{
  "summary": "brief summary",
  "keyPoints": ["point1", "point2"],
  "actionItems": ["action1", "action2"],
  "followUp": "recommended follow-up"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    const call = await prisma.phoneCall.update({
      where: { id },
      data: { aiSummary: result.summary }
    });

    res.json({ call, analysis: result });
  } catch (error) {
    console.error('AI call summary error:', error);
    res.status(500).json({ error: 'Failed to generate call summary' });
  }
});

// Get calls
router.get('/calls', async (req, res) => {
  try {
    const { userId, projectId, status } = req.query;
    const where: any = {};
    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const calls = await prisma.phoneCall.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(calls);
  } catch (error) {
    console.error('Get calls error:', error);
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
});

// Meeting management
router.post('/meetings', async (req, res) => {
  try {
    const { title, agenda, startTime, endTime, location, attendees, projectId, userId } = req.body;

    const meeting = await prisma.meeting.create({
      data: {
        title,
        agenda,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        attendees: attendees || [],
        projectId,
        userId
      }
    });

    // Notify attendees
    await prisma.notification.create({
      data: {
        userId,
        title: 'Meeting Scheduled',
        message: `${title} scheduled for ${new Date(startTime).toLocaleString()}`,
        type: 'MEETING_SCHEDULED',
        actionUrl: `/meetings/${meeting.id}`
      }
    });

    res.json(meeting);
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});

// AI meeting notes
router.post('/meetings/:id/ai-notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { transcript, audioUrl } = req.body;

    const prompt = `Generate professional meeting notes from this construction meeting:

${transcript}

Provide JSON with:
{
  "summary": "executive summary",
  "attendees": ["person1", "person2"],
  "keyDecisions": ["decision1", "decision2"],
  "actionItems": [{"task": "task1", "assignedTo": "person", "dueDate": "date"}],
  "nextSteps": "recommended next steps"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    const meeting = await prisma.meeting.update({
      where: { id },
      data: {
        aiNotes: JSON.stringify(result),
        minutes: result.summary
      }
    });

    res.json({ meeting, notes: result });
  } catch (error) {
    console.error('AI meeting notes error:', error);
    res.status(500).json({ error: 'Failed to generate meeting notes' });
  }
});

// Get meetings
router.get('/meetings', async (req, res) => {
  try {
    const { userId, projectId, status } = req.query;
    const where: any = {};
    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const meetings = await prisma.meeting.findMany({
      where,
      include: { project: true },
      orderBy: { startTime: 'desc' }
    });

    res.json(meetings);
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// Get notifications
router.get('/notifications', async (req, res) => {
  try {
    const { userId, read } = req.query;
    const where: any = { userId };
    if (read !== undefined) where.read = read === 'true';

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
    res.json(notification);
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

export default router;
