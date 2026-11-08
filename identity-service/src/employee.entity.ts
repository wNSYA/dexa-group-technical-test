// identity-service/src/employee.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  division!: string;

  @OneToOne(() => Account, account => account.employee)
  account!: Account;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}