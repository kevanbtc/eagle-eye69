import { Router } from 'express';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Apply authentication to all estimate routes
router.use(authenticate);

// Get all estimates
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
    const estimates = await prisma.estimate.findMany({
      where: projectId ? { projectId: projectId as string } : undefined,
      include: {
        project: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        lineItems: true,
        _count: { select: { lineItems: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(estimates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single estimate with line items
router.get('/:id', async (req, res) => {
  try {
    const estimate = await prisma.estimate.findUnique({
      where: { id: req.params.id },
      include: {
        project: true,
        user: true,
        lineItems: {
          include: { material: true },
          orderBy: { sortOrder: 'asc' }
        },
        exports: true
      }
    });
    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }
    res.json(estimate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create estimate
router.post('/', async (req, res) => {
  try {
    const { lineItems, ...estimateData } = req.body;
    
    const estimate = await prisma.estimate.create({
      data: {
        ...estimateData,
        lineItems: {
          create: lineItems || []
        }
      },
      include: { lineItems: true }
    });
    
    res.status(201).json(estimate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update estimate
router.put('/:id', async (req, res) => {
  try {
    const { lineItems, ...estimateData } = req.body;
    
    const estimate = await prisma.estimate.update({
      where: { id: req.params.id },
      data: estimateData,
      include: { lineItems: true }
    });
    
    res.json(estimate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete estimate
router.delete('/:id', async (req, res) => {
  try {
    await prisma.estimate.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Estimate deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add line item to estimate
router.post('/:id/line-items', async (req, res) => {
  try {
    const lineItem = await prisma.estimateLineItem.create({
      data: {
        ...req.body,
        estimateId: req.params.id
      }
    });
    res.status(201).json(lineItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
