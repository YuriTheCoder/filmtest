import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Cinema App API')
    .setDescription('Full-featured cinema catalog API with TMDB integration')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('movies', 'Movie catalog')
    .addTag('genres', 'Movie genres')
    .addTag('reviews', 'Movie reviews')
    .addTag('favorites', 'User favorites')
    .addTag('watchlist', 'User watchlist')
    .addTag('admin', 'Admin operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
    🎬 Cinema App API is running!

    📡 Server:     http://localhost:${port}/api
    📚 API Docs:   http://localhost:${port}/api/docs
    🗄️  Database:   PostgreSQL on port 5432
    🔴 Redis:      localhost:6379
    🖥️  pgAdmin:    http://localhost:5050

    Environment: ${process.env.NODE_ENV || 'development'}
  `);
}

bootstrap();
