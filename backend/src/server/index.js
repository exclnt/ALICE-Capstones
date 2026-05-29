import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import cors from 'cors';

import router from '../routes/index.js';
import errorHandler from '../middlewares/errorHandler.js';
import { NotFoundError } from '../exceptions/index.js';

const app = express();

app.use(express.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'A.L.I.C.E API Documentation',
      version: '1.0.0',
      description: 'API documentation for A.L.I.C.E application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/services/*/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,

    api: {
      name: 'A.L.I.C.E Finance Tracker API',
      description:
        'A RESTful API for managing personal finance, transactions, budgeting, and expense tracking.',
      version: '1.0.0',
    },

    status: {
      message: 'API service is running successfully',
      environment: process.env.NODE_ENV || 'development',
      uptime: `${process.uptime().toFixed(0)} seconds`,
      timestamp: new Date().toISOString(),
    },

    maintainer: {
      name: 'exclnt',
      github: 'https://github.com/exclnt',
      email: 'exclntmail@gmail.com',
    },

    documentation: {
      swagger: '/docs',
    },

    resources: {
      repository: 'https://github.com/exclnt/ALICE-Capstones',
      homepage: 'https://alice.vercel.app',
    },
  });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(morgan('dev'));

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use(router);

app.use((req, res, next) => {
  next(new NotFoundError('route tidak tersedia'));
});

app.use(errorHandler);

export default app;
