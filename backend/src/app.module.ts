import { Module } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NavigationModule } from './navigation/navigation.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ScrapingModule } from './scraping/scraping.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = process.env.NODE_ENV === 'production';
        const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

        if (databaseUrl) {
          console.log('Using POSTGRES database');
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: true, // Be careful with this in production
            ssl: { rejectUnauthorized: false },
          };
        }

        console.log('Using SQLITE database');

        if (isProduction) {
          // On Vercel, the filesystem is read-only except for /tmp
          // SQLite needs to write journal files, so we MUST copy it to /tmp
          const dbSource = path.join(process.cwd(), 'database.sqlite');
          const dbDest = path.join('/tmp', 'database.sqlite');

          console.log(`Copying database from ${dbSource} to ${dbDest}`);

          try {
            // We copy even if it exists to ensure we have the latest seed data from build
            if (fs.existsSync(dbSource)) {
              fs.copyFileSync(dbSource, dbDest);
            } else {
              console.error(`Database source file not found at ${dbSource}`);
            }
          } catch (error) {
            console.error('Error copying database to /tmp:', error);
          }

          return {
            type: 'sqlite',
            database: dbDest,
            autoLoadEntities: true,
            synchronize: false, // Disable schema sync in production
            logging: true,
          };
        }

        // Local Development
        return {
          type: 'sqlite',
          database: 'database.sqlite',
          autoLoadEntities: true,
          synchronize: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
    NavigationModule,
    CategoryModule,
    ProductModule,
    ScrapingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
