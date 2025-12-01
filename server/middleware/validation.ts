import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'ESTIMATOR', 'VIEWER']).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  type: z.enum(['SINGLE_FAMILY', 'MULTI_FAMILY', 'COMMERCIAL', 'INDUSTRIAL', 'RENOVATION']),
  status: z.enum(['LEAD', 'PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']).optional(),
  userId: z.string().uuid().optional()
});

export const updateProjectSchema = createProjectSchema.partial();

// Estimate schemas
export const createEstimateSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  name: z.string().min(3, 'Estimate name must be at least 3 characters'),
  description: z.string().optional(),
  laborCost: z.number().min(0).optional(),
  markupPercent: z.number().min(0).max(100).optional(),
  taxPercent: z.number().min(0).max(50).optional()
});

export const addLineItemSchema = z.object({
  materialId: z.string().uuid('Invalid material ID'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unitCost: z.number().min(0, 'Unit cost must be non-negative').optional(),
  description: z.string().optional()
});

// Material schemas
export const createMaterialSchema = z.object({
  name: z.string().min(2, 'Material name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  unit: z.string().min(1, 'Unit is required'),
  currentPrice: z.number().min(0, 'Price must be non-negative'),
  supplier: z.string().optional(),
  sku: z.string().optional(),
  isGreen: z.boolean().optional(),
  solarReady: z.boolean().optional(),
  certifications: z.array(z.string()).optional()
});

export const updateMaterialSchema = createMaterialSchema.partial();

// Marketing schemas
export const createCampaignSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  platform: z.enum(['NEXTDOOR', 'GOOGLE_LSA', 'FACEBOOK', 'INSTAGRAM', 'OTHER']),
  budget: z.number().min(0, 'Budget must be non-negative'),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()).optional(),
  targetNeighborhood: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']).optional()
});

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  address: z.string().optional(),
  source: z.string().min(1, 'Lead source is required'),
  campaignId: z.string().uuid('Invalid campaign ID').optional(),
  projectType: z.string().optional(),
  budget: z.number().min(0).optional(),
  notes: z.string().optional()
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone must be provided'
});

// AI schemas
export const aiPredictCostSchema = z.object({
  materialName: z.string().min(2, 'Material name is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  location: z.string().optional(),
  projectType: z.string().optional()
});

export const generateEstimateSchema = z.object({
  projectDescription: z.string().min(10, 'Project description must be at least 10 characters'),
  squareFootage: z.number().min(1, 'Square footage must be greater than 0'),
  projectType: z.string().min(2, 'Project type is required'),
  location: z.string().optional()
});

export const analyzeImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  analysisType: z.enum(['damage', 'progress', 'quality', 'estimate']).optional()
});

// Imagery schemas
export const generateRemodelConceptSchema = z.object({
  projectId: z.string().uuid('Invalid project ID').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  style: z.string().optional(),
  room: z.string().optional(),
  budget: z.string().optional(),
  userId: z.string().uuid().optional()
});

// Scheduling schemas
export const createAppointmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  startTime: z.string().datetime().or(z.date()),
  endTime: z.string().datetime().or(z.date()),
  location: z.string().optional(),
  attendees: z.array(z.string().email()).optional(),
  projectId: z.string().uuid().optional(),
  type: z.enum(['SITE_VISIT', 'CONSULTATION', 'FOLLOW_UP', 'REVIEW', 'OTHER']).optional()
});

// Vault schemas
export const tokenizeProjectSchema = z.object({
  assetType: z.enum(['PROPERTY', 'EQUITY', 'REVENUE_SHARE']),
  tokenSymbol: z.string().min(2).max(10, 'Token symbol must be 2-10 characters'),
  totalSupply: z.number().min(1, 'Total supply must be at least 1'),
  pricePerToken: z.number().min(0.01, 'Price per token must be greater than 0'),
  metadata: z.record(z.any()).optional()
});
