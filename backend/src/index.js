import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import { NotFoundError } from './exceptions/index.js';

import cors from 'cors';

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
  },
  apis: ['./src/routes/*.js', './src/services/*/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

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
