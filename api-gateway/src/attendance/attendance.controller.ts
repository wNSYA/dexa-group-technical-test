// api-gateway/src/attendance/attendance.controller.ts
import { Controller, Post, Body, Inject, UseGuards, Request, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
}