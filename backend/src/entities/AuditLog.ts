import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.auditLogs, { eager: true, nullable: true })
  user?: User | null;

  @Column()
  action!: string;

  @Column({ nullable: true })
  entityId?: string;

  @Column({ nullable: true })
  entityType?: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
