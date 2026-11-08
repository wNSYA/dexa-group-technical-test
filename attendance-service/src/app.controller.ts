import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'ping' })
  pingAttendance() {
    return { service: 'Attendance', status: 'Connected tok attendance_db' };
  }
}