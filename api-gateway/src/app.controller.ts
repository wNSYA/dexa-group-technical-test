// api-gateway/src/app.controller.ts
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs'; // 1. Import this from rxjs

@Controller('api')
export class AppController {
  constructor(
    @Inject('IDENTITY_SERVICE') private identityClient: ClientProxy,
    @Inject('ATTENDANCE_SERVICE') private attendanceClient: ClientProxy,
  ) {}

  @Get('status')
  async getStatus() { // 2. Add async here
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