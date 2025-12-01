import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const lead = {
      ...req.body,
      timestamp: new Date().toISOString(),
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Store in Vercel KV
    await kv.set(lead.id, JSON.stringify(lead));
    await kv.lpush('leads:all', lead.id);
    await kv.lpush(`leads:source:${lead.source || 'unknown'}`, lead.id);
    await kv.lpush(`leads:neighborhood:${lead.neighborhood || 'unknown'}`, lead.id);

    // Send email notification (optional - requires env vars)
    if (process.env.EMAIL_TO) {
      await sendEmailNotification(lead);
    }

    // Webhook to main Eagle Eye platform (optional)
    if (process.env.WEBHOOK_URL) {
      await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Lead captured successfully',
      leadId: lead.id
    });

  } catch (error) {
    console.error('Error capturing lead:', error);
    return res.status(500).json({ 
      error: 'Failed to capture lead',
      message: error.message 
    });
  }
}

async function sendEmailNotification(lead) {
  // Using a simple email service (you can customize this)
  const emailData = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_FROM || 'noreply@eagleeye.com',
    subject: `🦅 New Lead: ${lead.name} - ${lead.serviceType}`,
    html: `
      <h2>New Lead Captured!</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Address:</strong> ${lead.address}</p>
      <p><strong>Neighborhood:</strong> ${lead.neighborhood || 'Not specified'}</p>
      <p><strong>Service Type:</strong> ${lead.serviceType}</p>
      <p><strong>Source:</strong> ${lead.source || 'Unknown'}</p>
      <p><strong>Details:</strong></p>
      <p>${lead.details || 'No additional details provided'}</p>
      <hr>
      <p><small>Captured: ${new Date().toLocaleString()}</small></p>
    `
  };

  // If using SendGrid
  if (process.env.SENDGRID_API_KEY) {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify(emailData)
    });
  }
  
  // If using Resend
  if (process.env.RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify(emailData)
    });
  }
}
