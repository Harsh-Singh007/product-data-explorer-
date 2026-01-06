import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from './entities/navigation.entity';
import { NavigationController } from './navigation.controller';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Navigation]),
        ScrapingModule
    ],
    controllers: [NavigationController],
    providers: [],
    exports: []
})
export class NavigationModule { }
