import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // For local development
  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`Backend running on http://localhost:${port}`);
  }

  await app.init();
  return app.getHttpAdapter().getInstance();
}

// For Vercel, we export the default function
const serverPromise = bootstrap();
export default async (req: any, res: any) => {
  const server = await serverPromise;
  return server(req, res);
};

