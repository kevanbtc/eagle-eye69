import { Router } from 'express';
import OpenAI from 'openai';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Apply authentication to all imagery routes
router.use(authenticate);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate remodeling concept images with DALL-E
router.post('/generate-remodel-concept', async (req, res) => {
  try {
    const { projectId, description, style, room, budget, userId } = req.body;

    const prompt = `Professional architectural rendering of a ${style || 'modern'} ${room || 'room'} remodel. ${description}. High-quality, realistic, construction-ready design. Budget-appropriate materials for ${budget || 'mid-range'} budget. Detailed finishes, proper lighting, accurate proportions.`;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural'
    });

    const imageUrl = response.data?.[0]?.url || '';

    // Save to database
    const aiImage = await prisma.aIGeneratedImage.create({
      data: {
        prompt,
        imageUrl,
        projectId,
        imageType: 'REMODEL_CONCEPT',
        model: 'dall-e-3',
        resolution: '1024x1024',
        style: style || 'modern',
        userId
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Remodel Concept Ready',
        message: `AI-generated design concept for your ${room} remodel is ready`,
        type: 'AI_GENERATION_COMPLETE',
        actionUrl: `/remodeling/${aiImage.id}`
      }
    });

    res.json(aiImage);
  } catch (error) {
    console.error('Generate concept error:', error);
    res.status(500).json({ error: 'Failed to generate concept image' });
  }
});

// Generate before/after visualization
router.post('/generate-before-after', async (req, res) => {
  try {
    const { originalImageUrl, remodelingDescription, projectId, userId } = req.body;

    // Use Vision API to analyze original image
    const visionResponse = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `Analyze this room for remodeling. Describe: layout, current condition, materials, lighting, dimensions, problem areas. Then suggest improvements for: ${remodelingDescription}` },
            { type: 'image_url', image_url: { url: originalImageUrl } }
          ]
        }
      ],
      max_tokens: 500
    });

    const analysis = visionResponse.choices[0].message.content || '';

    // Generate "after" image based on analysis
    const afterPrompt = `Professional remodel transformation. ${analysis}. Improvements: ${remodelingDescription}. Photorealistic architectural rendering showing completed renovation with proper materials, lighting, and finishes.`;

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: afterPrompt,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural'
    });

    const afterImageUrl = imageResponse.data?.[0]?.url || '';

    // Save both images
    const aiImage = await prisma.aIGeneratedImage.create({
      data: {
        prompt: afterPrompt,
        imageUrl: afterImageUrl,
        projectId,
        imageType: 'BEFORE_AFTER',
        model: 'dall-e-3',
        resolution: '1024x1024',
        metadata: { originalImage: originalImageUrl, analysis },
        userId
      }
    });

    res.json({ 
      beforeImage: originalImageUrl, 
      afterImage: afterImageUrl, 
      analysis,
      record: aiImage 
    });
  } catch (error) {
    console.error('Before/after generation error:', error);
    res.status(500).json({ error: 'Failed to generate before/after visualization' });
  }
});

// Generate floor plan from description
router.post('/generate-floor-plan', async (req, res) => {
  try {
    const { rooms, squareFeet, style, features, projectId, userId } = req.body;

    const prompt = `Professional architectural floor plan. ${squareFeet} sq ft ${style} home. Rooms: ${rooms.join(', ')}. Features: ${features.join(', ')}. Clean blueprint style with proper dimensions, wall thickness, door swings, window placements, and room labels. Black and white technical drawing.`;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'hd'
    });

    const imageUrl = response.data?.[0]?.url || '';

    const aiImage = await prisma.aIGeneratedImage.create({
      data: {
        prompt,
        imageUrl,
        projectId,
        imageType: 'FLOOR_PLAN',
        model: 'dall-e-3',
        resolution: '1024x1024',
        metadata: { rooms, squareFeet, features },
        userId
      }
    });

    res.json(aiImage);
  } catch (error) {
    console.error('Floor plan generation error:', error);
    res.status(500).json({ error: 'Failed to generate floor plan' });
  }
});

// Analyze construction photo with Vision AI
router.post('/analyze-photo', async (req, res) => {
  try {
    const { imageUrl, analysisType } = req.body;

    let prompt = '';
    switch (analysisType) {
      case 'damage':
        prompt = 'Analyze this construction photo for damage, defects, or areas needing repair. List specific issues with severity levels.';
        break;
      case 'progress':
        prompt = 'Assess construction progress in this photo. Estimate completion percentage, identify completed tasks, and note remaining work.';
        break;
      case 'quality':
        prompt = 'Evaluate workmanship quality in this photo. Check for code compliance, proper technique, material quality, and finish quality.';
        break;
      case 'estimate':
        prompt = 'Analyze this space for remodeling estimate. Identify: room dimensions, current materials, fixtures, required work, and estimated costs.';
        break;
      default:
        prompt = 'Provide a detailed construction analysis of this photo including materials, condition, and recommendations.';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1000
    });

    const analysis = response.choices[0].message.content || '';

    res.json({ analysis, imageUrl, analysisType });
  } catch (error) {
    console.error('Photo analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze photo' });
  }
});

// Create remodeling project with passthrough data
router.post('/remodeling-projects', async (req, res) => {
  try {
    const { name, description, projectId, originalImage, passthroughData, userId } = req.body;

    const remodelingProject = await prisma.remodelingProject.create({
      data: {
        name,
        description,
        projectId,
        originalImage,
        conceptImages: [],
        passthroughData,
        userId
      }
    });

    res.json(remodelingProject);
  } catch (error) {
    console.error('Create remodeling project error:', error);
    res.status(500).json({ error: 'Failed to create remodeling project' });
  }
});

// Add concept image to remodeling project
router.post('/remodeling-projects/:id/add-concept', async (req, res) => {
  try {
    const { id } = req.params;
    const { conceptImageUrl } = req.body;

    const project = await prisma.remodelingProject.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updatedProject = await prisma.remodelingProject.update({
      where: { id },
      data: {
        conceptImages: [...project.conceptImages, conceptImageUrl]
      }
    });

    res.json(updatedProject);
  } catch (error) {
    console.error('Add concept error:', error);
    res.status(500).json({ error: 'Failed to add concept image' });
  }
});

// Select design for remodeling project
router.put('/remodeling-projects/:id/select-design', async (req, res) => {
  try {
    const { id } = req.params;
    const { selectedDesign, estimateId } = req.body;

    const project = await prisma.remodelingProject.update({
      where: { id },
      data: {
        selectedDesign,
        estimateId,
        status: 'APPROVED'
      }
    });

    res.json(project);
  } catch (error) {
    console.error('Select design error:', error);
    res.status(500).json({ error: 'Failed to select design' });
  }
});

// Get AI-generated images
router.get('/generated-images', async (req, res) => {
  try {
    const { projectId, imageType, userId } = req.query;
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (imageType) where.imageType = imageType;
    if (userId) where.userId = userId;

    const images = await prisma.aIGeneratedImage.findMany({
      where,
      include: { project: true, estimate: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(images);
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Get remodeling projects
router.get('/remodeling-projects', async (req, res) => {
  try {
    const { projectId, userId, status } = req.query;
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const projects = await prisma.remodelingProject.findMany({
      where,
      include: { project: true, estimate: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(projects);
  } catch (error) {
    console.error('Get remodeling projects error:', error);
    res.status(500).json({ error: 'Failed to fetch remodeling projects' });
  }
});

// Generate multiple design variations
router.post('/generate-variations', async (req, res) => {
  try {
    const { baseDescription, styles, projectId, userId } = req.body;
    const variations = [];

    for (const style of styles) {
      const prompt = `${baseDescription}. Style: ${style}. Professional architectural rendering, photorealistic, high quality.`;

      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural'
      });

      const imageUrl = response.data?.[0]?.url || '';

      const aiImage = await prisma.aIGeneratedImage.create({
        data: {
          prompt,
          imageUrl,
          projectId,
          imageType: 'REMODEL_CONCEPT',
          model: 'dall-e-3',
          resolution: '1024x1024',
          style,
          userId
        }
      });

      variations.push(aiImage);
    }

    res.json(variations);
  } catch (error) {
    console.error('Generate variations error:', error);
    res.status(500).json({ error: 'Failed to generate variations' });
  }
});

export default router;
