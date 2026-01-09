import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Navigation } from '../../navigation/entities/navigation.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    url: string;

    @ManyToOne(() => Navigation, { nullable: true })
    @JoinColumn({ name: 'navigationId' })
    navigation: Navigation;

    @Column({ nullable: true })
    navigationId: number;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: Category;

    @Column({ nullable: true })
    parentId: number;

    @Column({ default: 0 })
    productCount: number;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @Column({ nullable: true })
    lastScrapedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
