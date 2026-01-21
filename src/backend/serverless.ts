/**
 * Serverless entry point for AWS Lambda
 * This file exports the NestJS app as a serverless function
 */

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';

let cachedApp: express.Express;

async function createApp(): Promise<express.Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

// AWS Lambda handler
export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const app = await createApp();
  
  // Convert Lambda event to Express request/response
  const { createServer, proxy } = await import('aws-serverless-express');
  const server = createServer(app, undefined, [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
  ]);
  
  return proxy(server, event, context, 'PROMISE').promise;
};
