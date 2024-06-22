import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Reemplaza con el origen de tu aplicación front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  };

  app.enableCors(corsOptions);

  await app.listen(8000);
}
bootstrap();
