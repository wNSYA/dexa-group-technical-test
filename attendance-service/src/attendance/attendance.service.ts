// attendance-service/src/attendance/attendance.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceType } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  async checkIn(data: { employeeId: number; type: AttendanceType; photoUrl: string }) {
    const record = this.attendanceRepo.create({
      employeeId: data.employeeId,
      type: data.type,
      photoUrl: data.photoUrl,
    });
    
    return await this.attendanceRepo.save(record);
  }
  async findAll() {
  // Find all records and sort them by the newest first
  return await this.attendanceRepo.find({
    order: {
      timestamp: 'DESC',
    },
  });
  }
}