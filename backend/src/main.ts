import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

//swagger logic  implementation
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';






async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(new ValidationPipe()); // Use validation pipe globally

  // Enable CORS
  app.enableCors({
    origin: 'https://ciu-exam-management-system-phillip.netlify.app/', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });



  // Create Swagger options
  const options = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('tags') // You can add tags to organize your endpoints
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, options);
  
  // Set up Swagger UI
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
