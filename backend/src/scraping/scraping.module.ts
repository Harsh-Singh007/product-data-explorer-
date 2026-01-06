import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeJob } from './entities/scrape-job.entity';
import { ScrapingService } from './scraping.service';

@Module({
    imports: [TypeOrmModule.forFeature([ScrapeJob])],
    controllers: [],
    providers: [ScrapingService],
    exports: [ScrapingService],
})
export class ScrapingModule { }
