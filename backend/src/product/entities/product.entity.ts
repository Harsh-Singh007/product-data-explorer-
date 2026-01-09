import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProductDetail } from './product-detail.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    sourceId: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    price: number;

    @Column({ nullable: true })
    currency: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ unique: true })
    sourceUrl: string;

    @Column({ nullable: true })
    lastScrapedAt: Date;

    @OneToOne(() => ProductDetail, (detail) => detail.product, { cascade: true })
    detail: ProductDetail;

    @ManyToOne(() => Category, (category) => category.products, { nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column({ nullable: true })
    categoryId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
