import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get config service
  const configService = app.get(ConfigService);
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Setup API prefix
  const appConfig = configService.getApp();
  app.setGlobalPrefix(appConfig.apiPrefix);
  
  // Setup Swagger
  const swaggerConfig = configService.getSwagger();
  if (swaggerConfig.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConfig.path, app, document);
  }
  
  // Enable CORS
  app.enableCors({
    origin: configService.getApp().frontendUrl,
    credentials: true,
  });
  
  await app.listen(configService.getApp().port);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Environment: ${configService.getEnv()}`);
  if (swaggerConfig.enabled) {
    console.log(`Swagger: ${await app.getUrl()}/${swaggerConfig.path}`);
  }
}
bootstrap();
