import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── CORS ──
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      /\.vercel\.app$/,
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  });

  // ── Global validation pipe ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Swagger ──
  const config = new DocumentBuilder()
    .setTitle('Numerical Differentiation Calculator API')
    .setDescription(
      'REST API for computing numerical derivatives using Newton Forward and Backward Difference Methods. ' +
      'Supports full difference-table generation, step-by-step solutions, and multiple worked examples.',
    )
    .setVersion('1.0.0')
    .addTag('Calculator', 'Numerical differentiation endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'NumDiff API — Swagger',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // ── Start ──
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`\n🚀  Numerical Differentiation API running on http://localhost:${port}`);
  console.log(`📖  Swagger docs at http://localhost:${port}/api/docs\n`);
}

bootstrap();
