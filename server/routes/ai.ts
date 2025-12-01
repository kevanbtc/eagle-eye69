import { Router } from 'express';
import OpenAI from 'openai';
import { prisma } from '../index.js';

const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// AI cost prediction for materials
router.post('/predict-cost', async (req, res) => {
  try {
    const { materialName, category, quantity, region, isGreen } = req.body;

    const prompt = `You are a construction cost estimator. Provide a cost estimate for:
- Material: ${materialName}
- Category: ${category}
- Quantity: ${quantity}
- Region: ${region || 'US Average'}
- Green/Sustainable: ${isGreen ? 'Yes' : 'No'}

Provide a JSON response with:
{
  "estimatedUnitCost": <number>,
  "confidence": <percentage>,
  "reasoning": "<brief explanation>",
  "priceRange": { "min": <number>, "max": <number> }
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Log AI usage
    await prisma.aIEstimateLog.create({
      data: {
        prompt,
        response: result,
        model: 'gpt-4',
        tokenUsed: completion.usage?.total_tokens || 0,
        costUSD: ((completion.usage?.total_tokens || 0) * 0.00003) // Approximate cost
      }
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate estimate from description
router.post('/generate-estimate', async (req, res) => {
  try {
    const { projectDescription, projectType, squareFootage } = req.body;

    const prompt = `You are a construction estimator. Generate a detailed cost breakdown for:
Project Type: ${projectType}
Square Footage: ${squareFootage}
Description: ${projectDescription}

Provide a JSON array of line items with:
[
  {
    "category": "Foundation|Framing|Roofing|Electrical|Plumbing|HVAC|Finishes",
    "description": "<specific item>",
    "quantity": <number>,
    "unit": "sf|lf|ea|ls",
    "estimatedUnitCost": <number>
  }
]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"items": []}');

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze estimate for cost optimization
router.post('/optimize-estimate/:id', async (req, res) => {
  try {
    const estimate = await prisma.estimate.findUnique({
      where: { id: req.params.id },
      include: { lineItems: { include: { material: true } } }
    });

    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    const prompt = `Analyze this construction estimate and suggest cost optimizations:
${JSON.stringify(estimate.lineItems.slice(0, 20), null, 2)}

Provide JSON response with:
{
  "potentialSavings": <total dollar amount>,
  "recommendations": [
    {
      "lineItem": "<description>",
      "suggestion": "<what to change>",
      "estimatedSavings": <dollars>
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Blueprint/Plan Analysis - Extract estimates from uploaded plans
router.post('/analyze-blueprint', async (req, res) => {
  try {
    const { imageUrl, projectType, userId } = req.body;

    const prompt = `Analyze this construction blueprint/plan. Extract:
1. Overall dimensions and square footage
2. Number and type of rooms
3. Structural elements (walls, doors, windows)
4. Material requirements
5. Labor estimates
6. Cost breakdown by category

Provide detailed JSON for estimate generation.`;

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
      max_tokens: 2000
    });

    const analysis = response.choices[0].message.content || '';

    // Log AI usage
    await prisma.aIEstimateLog.create({
      data: {
        prompt: `Blueprint analysis: ${imageUrl}`,
        response: { analysis },
        model: 'gpt-4-vision-preview',
        tokenUsed: response.usage?.total_tokens || 0,
        costUSD: ((response.usage?.total_tokens || 0) * 0.00003)
      }
    });

    res.json({ analysis, blueprintUrl: imageUrl });
  } catch (error: any) {
    console.error('Blueprint analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Auto-generate complete estimate from project details
router.post('/auto-estimate', async (req, res) => {
  try {
    const { projectId, projectDescription, squareFootage, projectType, includeGreen, userId } = req.body;

    const prompt = `Generate a comprehensive construction estimate for:
Type: ${projectType}
Size: ${squareFootage} sq ft
Description: ${projectDescription}
Green/Sustainable: ${includeGreen ? 'Yes - include eco-friendly alternatives' : 'No'}

Create a complete estimate with:
1. Foundation & Sitework
2. Framing & Structure
3. Exterior (roofing, siding, windows, doors)
4. Electrical systems
5. Plumbing & HVAC
6. Interior finishes (drywall, flooring, cabinets, countertops)
7. Paint & final touches
8. Permits & fees

For each line item provide:
{
  "category": "<category>",
  "description": "<specific item>",
  "quantity": <number>,
  "unit": "sf|lf|ea|ls",
  "unitCost": <estimated cost per unit>,
  "laborHours": <estimated hours>,
  "isGreen": <boolean>,
  "notes": "<material specs or alternatives>"
}

Return JSON object with "lineItems" array.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"lineItems": []}');

    // Calculate totals
    let totalMaterialCost = 0;
    let totalLaborCost = 0;

    const lineItems = result.lineItems.map((item: any, index: number) => {
      const totalCost = item.quantity * item.unitCost;
      const laborCost = (item.laborHours || 0) * 65; // $65/hour avg
      totalMaterialCost += totalCost;
      totalLaborCost += laborCost;

      return {
        ...item,
        totalCost: totalCost + laborCost,
        sortOrder: index
      };
    });

    const totalCost = totalMaterialCost + totalLaborCost;
    const markup = totalCost * 0.18; // 18% markup
    const finalTotal = totalCost + markup;

    // Create estimate in database if projectId provided
    if (projectId) {
      const estimate = await prisma.estimate.create({
        data: {
          name: `AI-Generated Estimate - ${new Date().toLocaleDateString()}`,
          projectId,
          userId,
          totalCost: finalTotal,
          laborCost: totalLaborCost,
          materialCost: totalMaterialCost,
          markupPercent: 18,
          profitMargin: markup,
          aiGenerated: true,
          lineItems: {
            create: lineItems.map((item: any) => ({
              category: item.category,
              description: item.description,
              quantity: item.quantity,
              unit: item.unit,
              unitCost: item.unitCost,
              totalCost: item.totalCost,
              laborHours: item.laborHours || 0,
              isGreen: item.isGreen || false,
              notes: item.notes,
              sortOrder: item.sortOrder
            }))
          }
        },
        include: { lineItems: true }
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId,
          title: 'AI Estimate Generated',
          message: `Complete estimate ready: $${finalTotal.toFixed(2)}`,
          type: 'ESTIMATE_READY',
          actionUrl: `/estimates/${estimate.id}`
        }
      });

      res.json({ estimate, summary: { totalCost: finalTotal, lineItemCount: lineItems.length } });
    } else {
      res.json({ lineItems, summary: { totalCost: finalTotal, materialCost: totalMaterialCost, laborCost: totalLaborCost, markup } });
    }
  } catch (error: any) {
    console.error('Auto-estimate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Smart material recommendations based on project type
router.post('/recommend-materials', async (req, res) => {
  try {
    const { projectType, budget, greenPreference, region } = req.body;

    const prompt = `Recommend construction materials for:
Project: ${projectType}
Budget: ${budget} (low/medium/high)
Green preference: ${greenPreference ? 'Yes - prioritize sustainable' : 'Standard'}
Region: ${region || 'US'}

For each category (framing, insulation, roofing, flooring, etc), recommend:
{
  "category": "<category>",
  "primaryChoice": {"name": "<material>", "cost": "<$/unit>", "pros": [], "cons": []},
  "alternatives": [{"name": "<material>", "cost": "<$/unit>", "pros": [], "cons": []}],
  "greenOption": {"name": "<material>", "cost": "<$/unit>", "certifications": [], "savings": "<annual energy/cost savings>"}
}

Return JSON with "recommendations" array.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"recommendations": []}');

    res.json(result);
  } catch (error: any) {
    console.error('Material recommendation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI construction timeline estimation
router.post('/estimate-timeline', async (req, res) => {
  try {
    const { projectType, squareFootage, complexity, crewSize } = req.body;

    const prompt = `Estimate construction timeline for:
Type: ${projectType}
Size: ${squareFootage} sq ft
Complexity: ${complexity} (low/medium/high)
Crew size: ${crewSize || 'standard'}

Break down by phase with:
{
  "phases": [
    {
      "name": "Foundation",
      "duration": <days>,
      "dependencies": [],
      "milestones": []
    }
  ],
  "totalDuration": <days>,
  "criticalPath": ["phase1", "phase2"],
  "weatherBufferDays": <days>
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    res.json(result);
  } catch (error: any) {
    console.error('Timeline estimation error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
