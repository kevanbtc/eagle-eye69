import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        estimates: { select: { id: true, name: true, totalCost: true, status: true } },
        _count: { select: { estimates: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        estimates: true,
        vaultAssets: true
      }
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        type: req.body.type,
        userId: req.body.userId, // TODO: Get from JWT token
      }
    });
    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Project deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
