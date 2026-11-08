// attendance-service/src/attendance/attendance.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';
import { AttendanceType } from './attendance.entity';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern({ cmd: 'check_in' })
  handleCheckIn(@Payload() data: { employeeId: number; type: AttendanceType; photoUrl: string }) {
    return this.attendanceService.checkIn(data);
  }

  @MessagePattern({ cmd: 'get_all_attendance' })
  getAll() {
    return this.attendanceService.findAll();
  }
}