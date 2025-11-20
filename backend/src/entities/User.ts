import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VehicleWash } from './VehicleWash';
import { AuditLog } from './AuditLog';

export enum UserRole {
  EMPLOYEE = 'employee',
  SUPERVISOR = 'supervisor',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role!: UserRole;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ default: true })
  active!: boolean;

  @OneToMany(() => VehicleWash, (wash) => wash.assignedEmployee)
  assignedWashes!: VehicleWash[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs!: AuditLog[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
