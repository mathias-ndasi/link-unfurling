import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AllExceptionsFilter } from './exceptions/http-exception.filter';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const config = new DocumentBuilder()
    .setTitle('Link Unfurling')
    .setDescription('This is a link unfurling app with NestJs and Prisma.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Register our global exception handler
  // app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT, () =>
    Logger.log(`Server listening on port:${process.env.PORT}`),
  );
}
bootstrap();
