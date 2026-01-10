import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from './entities/navigation.entity';
import { NavigationController } from './navigation.controller';
import { ScrapingModule } from '../scraping/scraping.module';
import { SeedingModule } from '../seeding/seeding.module';

@Module({
    imports: [TypeOrmModule.forFeature([Navigation]), ScrapingModule, SeedingModule],
    controllers: [NavigationController],
})
export class NavigationModule { }
