// identity-service/src/account.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { Employee } from './employee.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @ManyToOne(() => Role, role => role.accounts)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @OneToOne(() => Employee, employee => employee.account)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}