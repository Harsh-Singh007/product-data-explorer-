import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingService } from './seeding.service';
import { Navigation } from '../navigation/entities/navigation.entity';
import { Category } from '../category/entities/category.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Navigation, Category])
    ],
    providers: [SeedingService],
    exports: [SeedingService],
})
export class SeedingModule { }
