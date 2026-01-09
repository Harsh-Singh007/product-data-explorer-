import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Product, (product) => product.detail, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'simple-json', nullable: true })
    specs: any;

    @Column({ nullable: true })
    ratingsAvg: number;

    @Column({ default: 0 })
    reviewsCount: number;
}
