import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ScrapingService } from '../scraping/scraping.service';

describe('ProductController', () => {
    let controller: ProductController;

    const mockProductRepo = {
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue(null),
    };

    const mockScrapingService = {
        scrapeProductDetail: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockProductRepo,
                },
                {
                    provide: ScrapingService,
                    useValue: mockScrapingService,
                },
            ],
        }).compile();

        controller = module.get<ProductController>(ProductController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('search', () => {
        it('should return empty array if no query', async () => {
            expect(await controller.search('')).toEqual([]);
        });
    });
});
