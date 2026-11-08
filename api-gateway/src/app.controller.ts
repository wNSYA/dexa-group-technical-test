// api-gateway/src/app.controller.ts
import { Controller, Get, Post, Body, Inject, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('api')
export class AppController {
  constructor(
    @Inject('IDENTITY_SERVICE') private identityClient: ClientProxy,
    @Inject('ATTENDANCE_SERVICE') private attendanceClient: ClientProxy,
  ) {}

  @Post('auth/login')
  async login(@Body() loginDto: any) {
    return await lastValueFrom(
      this.identityClient.send({ cmd: 'login' }, loginDto).pipe(
        catchError((error) => {
          return throwError(() => new HttpException(error.message, HttpStatus.UNAUTHORIZED));
        })
      )
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @Get('status')
  async getStatus(@Request() req) { 
    console.log('User making request:', req.user.username);
    // 3. Await the response from each microservice using lastValueFrom
    const identityResponse = await lastValueFrom(
      this.identityClient.send({ cmd: 'ping' }, {})
    );
    
    const attendanceResponse = await lastValueFrom(
      this.attendanceClient.send({ cmd: 'ping' }, {})
    );

    return {
      gateway: 'Online',
      identity: identityResponse,
      attendance: attendanceResponse
    };
  }
}