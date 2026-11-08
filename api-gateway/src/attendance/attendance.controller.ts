// api-gateway/src/attendance/attendance.controller.ts
import { Controller, Post, Body, Inject, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/attendance')
export class AttendanceController {
  constructor(
    @Inject('ATTENDANCE_SERVICE') private attendanceClient: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Post('check-in')
  async checkIn(@Request() req, @Body() body: { type: string; photoUrl: string }) {
    // 1. Extract the secure employeeId directly from the verified JWT token
    const employeeId = req.user.employeeId;

    if (!['IN', 'OUT'].includes(body.type)) {
      throw new HttpException('Type must be IN or OUT', HttpStatus.BAD_REQUEST);
    }

    // 2. Forward the trusted data to the microservice
    const payload = {
      employeeId,
      type: body.type,
      photoUrl: body.photoUrl || 'https://mock-s3-bucket.com/default.jpg', // Mock photo for now
    };

    return await lastValueFrom(
      this.attendanceClient.send({ cmd: 'check_in' }, payload).pipe(
        catchError((error) => throwError(() => new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)))
      )
    );
  }
}