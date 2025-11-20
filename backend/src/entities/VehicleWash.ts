import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

export enum VehicleType {
  CAR = 'carro',
  MOTORCYCLE = 'moto',
}

export enum WashStatus {
  WAITING = 'en_espera',
  IN_PROGRESS = 'en_curso',
  FINISHED = 'terminado',
  PAID = 'pagado',
}

@Entity()
export class VehicleWash {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: VehicleType })
  vehicleType!: VehicleType;

  @Column()
  plate!: string;

  @Column({ type: 'datetime' })
  checkInAt!: Date;

  @Column()
  customerName!: string;

  @Column()
  customerDocument!: string;

  @Column()
  customerPhone!: string;

  @Column()
  washType!: string;

  @Column({ type: 'enum', enum: WashStatus, default: WashStatus.WAITING })
  status!: WashStatus;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount?: number;

  @Column({ type: 'datetime', nullable: true })
  paidAt?: Date;

  @ManyToOne(() => User, (user) => user.assignedWashes, { eager: true })
  assignedEmployee!: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  supervisor?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
