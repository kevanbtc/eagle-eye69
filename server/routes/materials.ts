import { Router } from 'express';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Apply authentication to all material routes
router.use(authenticate);

// Get all materials
router.get('/', async (req, res) => {
  try {
    const { category, isGreen, isSolar, search } = req.query;
    
    const materials = await prisma.material.findMany({
      where: {
        active: true,
        ...(category && { category: category as string }),
        ...(isGreen && { isGreen: isGreen === 'true' }),
        ...(isSolar && { isSolar: isSolar === 'true' }),
        ...(search && {
          OR: [
            { name: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } }
          ]
        })
      },
      include: {
        priceHistory: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json(materials);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single material
router.get('/:id', async (req, res) => {
  try {
    const material = await prisma.material.findUnique({
      where: { id: req.params.id },
      include: {
        priceHistory: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(material);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get material categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await prisma.material.findMany({
      where: { active: true },
      select: { category: true },
      distinct: ['category']
    });
    res.json(categories.map(c => c.category));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create material
router.post('/', async (req, res) => {
  try {
    const material = await prisma.material.create({
      data: req.body
    });
    res.status(201).json(material);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update material
router.put('/:id', async (req, res) => {
  try {
    const material = await prisma.material.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(material);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add price history entry
router.post('/:id/price-history', async (req, res) => {
  try {
    const priceEntry = await prisma.materialPriceHistory.create({
      data: {
        materialId: req.params.id,
        ...req.body
      }
    });
    res.status(201).json(priceEntry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
