// attendance-service/src/attendance.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// Define the valid types of attendance
export enum AttendanceType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  employeeId!: number;

  @Column({
    type: 'enum',
    enum: AttendanceType,
  })
  type!: AttendanceType;

  @Column()
  photoUrl!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}