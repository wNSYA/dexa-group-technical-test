// api-gateway/src/attendance/attendance.controller.ts
import { Controller, Get, Post, Body, Inject, UseGuards, Request, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/attendance')
export class AttendanceController {
  constructor(
    @Inject('ATTENDANCE_SERVICE') private attendanceClient: ClientProxy,
    @Inject('IDENTITY_SERVICE') private identityClient: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Post('check-in')
  @UseInterceptors(FileInterceptor('photo', {
    // Configure where and how to save the file
    storage: diskStorage({
      destination: './uploads', // The folder in the gateway root
      filename: (req, file, callback) => {
        // Generate a unique filename: <timestamp>-<random>.<ext>
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
    // Only allow image files
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return callback(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
      }
      callback(null, true);
    },
  }))
  async checkIn(
    @Request() req, 
    @Body() body: { type: string },
    @UploadedFile() file: Express.Multer.File // Extract the saved file info
    ) {
    if (!file) {
      throw new HttpException('Photo is required for check-in', HttpStatus.BAD_REQUEST);
    }

    if (!['IN', 'OUT'].includes(body.type)) {
      throw new HttpException('Type must be IN or OUT', HttpStatus.BAD_REQUEST);
    }

    // 1. Generate the URL to access this photo
    // (Assuming the Gateway is running on localhost:3000)
    const photoUrl = `http://localhost:3000/uploads/${file.filename}`;

    // 2. Forward the trusted data to the microservice
    const payload = {
      employeeId: req.user.employeeId,
      type: body.type,
      photoUrl: photoUrl,
    };

    return await lastValueFrom(
      this.attendanceClient.send({ cmd: 'check_in' }, payload).pipe(
        catchError((error) => throwError(() => new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)))
      )
    );
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')                  
  @Get('all')
  async getAllAttendance() {
    try {
      // 2. Fetch raw attendance records
      const records = await lastValueFrom(
        this.attendanceClient.send({ cmd: 'get_all_attendance' }, {})
      );

      if (!records || records.length === 0) return [];

      // 3. Extract a unique list of employee IDs to prevent fetching the same ID twice
      const uniqueEmployeeIds = [...new Set(records.map(record => record.employeeId))];

      // 4. Fetch the employee details from the Identity Service
      const employees = await lastValueFrom(
        this.identityClient.send({ cmd: 'get_employees_by_ids' }, uniqueEmployeeIds)
      );

      // 5. Create a lookup dictionary for blazing fast O(1) matching: { 1: 'Super Admin', 2: 'John Doe' }
      const employeeMap = employees.reduce((acc, emp) => {
        acc[emp.id] = `${emp.firstName} ${emp.lastName}`;
        return acc;
      }, {});

      // 6. Merge the data and send to React
      return records.map(record => ({
        ...record,
        employeeName: employeeMap[record.employeeId] || 'Unknown Employee',
      }));

    } catch (error) {
      console.error('Aggregation Error:', error);
      throw new HttpException('Failed to fetch dashboard data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}