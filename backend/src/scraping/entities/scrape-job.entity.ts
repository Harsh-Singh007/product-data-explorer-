import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum ScrapeStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

@Entity()
export class ScrapeJob {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    targetUrl: string;

    @Column()
    targetType: string;

    @Column({
        type: 'text',
        default: ScrapeStatus.PENDING,
    })
    status: string;

    @Column({ type: 'text', nullable: true })
    errorLog: string;

    @Column({ nullable: true })
    startedAt: Date;

    @Column({ nullable: true })
    finishedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
