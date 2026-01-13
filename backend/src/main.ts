import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Product Explorer API')
      .setDescription('The World of Books (WOB) Scraper API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // For local development (only run listen if not on Vercel)
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      const port = process.env.PORT ?? 3000;
      await app.listen(port);
      console.log(`Backend running on http://localhost:${port}`);
    }

    await app.init();
    return app.getHttpAdapter().getInstance();
  } catch (err) {
    console.error('Error during NestJS bootstrap:', err);
    throw err;
  }
}

// For local development, start the server immediately
if (require.main === module) {
  bootstrap();
}

// Initializing the server once for Vercel
let server: any;

export default async (req: any, res: any) => {
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
};
