import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Eagle Eye Construction API',
      version: '2.0.0',
      description: 'Complete construction estimating platform with AI-powered cost prediction, marketing ROI tracking, and imagery generation',
      contact: {
        name: 'Eagle Eye Support',
        url: 'https://github.com/kevanbtc/eagle-eye69'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://eagle-eye-api.vercel.app',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'ESTIMATOR', 'VIEWER'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            address: { type: 'string' },
            type: { type: 'string', enum: ['SINGLE_FAMILY', 'MULTI_FAMILY', 'COMMERCIAL', 'INDUSTRIAL', 'RENOVATION'] },
            status: { type: 'string', enum: ['LEAD', 'PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Material: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            unit: { type: 'string' },
            currentPrice: { type: 'number' },
            supplier: { type: 'string' },
            isGreen: { type: 'boolean' },
            solarReady: { type: 'boolean' }
          }
        },
        Campaign: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            platform: { type: 'string', enum: ['NEXTDOOR', 'GOOGLE_LSA', 'FACEBOOK', 'INSTAGRAM', 'OTHER'] },
            budget: { type: 'number' },
            spent: { type: 'number' },
            leads: { type: 'integer' },
            status: { type: 'string', enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'] }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Projects', description: 'Project management endpoints' },
      { name: 'Estimates', description: 'Estimate creation and management' },
      { name: 'Materials', description: 'Materials database and pricing' },
      { name: 'Marketing', description: 'Campaign and lead management' },
      { name: 'AI', description: 'AI-powered features' },
      { name: 'Imagery', description: 'DALL-E image generation' },
      { name: 'Scheduling', description: 'Calendar and appointments' },
      { name: 'Exports', description: 'Excel and PDF exports' },
      { name: 'Vault', description: 'Tokenization and vault' }
    ]
  },
  apis: ['./server/routes/*.ts', './server/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
