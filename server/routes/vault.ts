import { Router } from 'express';
import axios from 'axios';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const VAULT_API_URL = process.env.VAULT_API_URL || 'https://vault.unykorn.com/api';
const VAULT_API_KEY = process.env.VAULT_API_KEY || '';

// Apply authentication to all vault routes
router.use(authenticate);

// Tokenize project asset
router.post('/tokenize/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { assetType, value, metadata } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Call Unykorn vault API
    const vaultResponse = await axios.post(
      `${VAULT_API_URL}/tokenize`,
      {
        assetType,
        value,
        metadata: {
          projectId,
          projectName: project.name,
          ...metadata
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${VAULT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Save vault asset record
    const vaultAsset = await prisma.vaultAsset.create({
      data: {
        projectId,
        assetType,
        tokenId: vaultResponse.data.tokenId,
        vaultReference: vaultResponse.data.reference,
        value,
        metadata: vaultResponse.data,
        status: 'TOKENIZED'
      }
    });

    res.json(vaultAsset);
  } catch (error: any) {
    console.error('Vault tokenization error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Tokenization failed', 
      details: error.response?.data || error.message 
    });
  }
});

// Get vault assets for project
router.get('/assets/:projectId', async (req, res) => {
  try {
    const assets = await prisma.vaultAsset.findMany({
      where: { projectId: req.params.projectId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(assets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get vault asset status
router.get('/asset/:id/status', async (req, res) => {
  try {
    const asset = await prisma.vaultAsset.findUnique({
      where: { id: req.params.id }
    });

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Query vault for current status
    const vaultResponse = await axios.get(
      `${VAULT_API_URL}/asset/${asset.vaultReference}`,
      {
        headers: {
          'Authorization': `Bearer ${VAULT_API_KEY}`
        }
      }
    );

    res.json({
      ...asset,
      vaultStatus: vaultResponse.data
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
