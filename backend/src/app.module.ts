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
import { SeedingModule } from './seeding/seeding.module';

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
          const dbDest = path.join('/tmp', 'database.sqlite');

          // Find the source database file (it might be in root, or inside dist/...)
          const potentialPaths = [
            path.join(process.cwd(), 'database.sqlite'),
            path.join(__dirname, 'database.sqlite'),
            path.join(__dirname, '..', 'database.sqlite'),
            path.join(process.cwd(), 'backend', 'database.sqlite'), // In case cwd is repo root
          ];

          let dbSource = '';
          for (const p of potentialPaths) {
            if (fs.existsSync(p)) {
              dbSource = p;
              console.log(`Found database at ${p}`);
              break;
            }
          }

          if (dbSource) {
            console.log(`Copying database from ${dbSource} to ${dbDest}`);
            try {
              fs.copyFileSync(dbSource, dbDest);
            } catch (error) {
              console.error('Error copying database to /tmp:', error);
            }
          } else {
            console.error(`CRITICAL: Database file not found in: ${potentialPaths.join(', ')}`);
            // We will continue, which will create an empty DB at dbDest due to synchronize: true
          }

          return {
            type: 'sqlite',
            database: dbDest,
            autoLoadEntities: true,
            synchronize: true,
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
    SeedingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
