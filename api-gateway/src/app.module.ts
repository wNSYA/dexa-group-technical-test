// api-gateway/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { EmployeeModule } from './employee/employee.module';
import { UploadsController } from './uploads/uploads.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    AuthModule,
    AttendanceModule,
    EmployeeModule,
  ],
  controllers: [UploadsController],
})
export class AppModule {}