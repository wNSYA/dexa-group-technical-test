// api-gateway/src/attendance/attendance.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AttendanceController } from './attendance.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ATTENDANCE_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3002 },
      },
    ]),
  ],
  controllers: [AttendanceController]
})
export class AttendanceModule {}