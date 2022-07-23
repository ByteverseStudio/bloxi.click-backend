import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('bloxi.click Backend')
  .setDescription('desc')
  .setVersion('1.0')
  .addTag('user')
  .addApiKey({
        type: 'apiKey',
        in: "header",
        description: "ApiKey to authorize"
      },
      "Authorization"
  ).build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
