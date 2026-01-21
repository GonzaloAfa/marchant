import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerService } from './services/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Método Marchant API')
      .setDescription('Sistema Operativo para Producción de Capital Académico')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  // Get logger from app context
  const logger = app.get(LoggerService);
  
  logger.info(`🚀 Método Marchant API running on: http://localhost:${port}`, 'Bootstrap');
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`📚 Swagger docs: http://localhost:${port}/api/docs`, 'Bootstrap');
  }
}

// Only bootstrap if not in serverless environment
if (require.main === module) {
  bootstrap();
}

export { bootstrap };
