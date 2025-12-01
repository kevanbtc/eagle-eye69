import { describe, it, expect } from 'vitest';
import { 
  registerSchema, 
  loginSchema, 
  createProjectSchema,
  createMaterialSchema,
  createCampaignSchema
} from '../server/middleware/validation.js';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123',
        name: 'Test User'
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
        name: 'Test User'
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'A'
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createProjectSchema', () => {
    it('should validate correct project data', () => {
      const validData = {
        name: 'Test Project',
        address: '123 Main St',
        type: 'SINGLE_FAMILY'
      };

      const result = createProjectSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid project type', () => {
      const invalidData = {
        name: 'Test Project',
        address: '123 Main St',
        type: 'INVALID_TYPE'
      };

      const result = createProjectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short project name', () => {
      const invalidData = {
        name: 'AB',
        address: '123 Main St',
        type: 'SINGLE_FAMILY'
      };

      const result = createProjectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createMaterialSchema', () => {
    it('should validate correct material data', () => {
      const validData = {
        name: 'Tesla Solar Roof',
        category: 'Solar',
        unit: 'sqft',
        currentPrice: 28.50
      };

      const result = createMaterialSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject negative price', () => {
      const invalidData = {
        name: 'Test Material',
        category: 'Test',
        unit: 'ea',
        currentPrice: -10
      };

      const result = createMaterialSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createCampaignSchema', () => {
    it('should validate correct campaign data', () => {
      const validData = {
        name: 'Test Campaign',
        platform: 'NEXTDOOR',
        budget: 500,
        startDate: new Date().toISOString()
      };

      const result = createCampaignSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid platform', () => {
      const invalidData = {
        name: 'Test Campaign',
        platform: 'INVALID_PLATFORM',
        budget: 500,
        startDate: new Date().toISOString()
      };

      const result = createCampaignSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative budget', () => {
      const invalidData = {
        name: 'Test Campaign',
        platform: 'NEXTDOOR',
        budget: -100,
        startDate: new Date().toISOString()
      };

      const result = createCampaignSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
