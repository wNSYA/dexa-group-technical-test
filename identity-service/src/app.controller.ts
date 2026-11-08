// identity-service/src/app.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'login' })
  login(@Payload() credentials: any) {
    return this.appService.login(credentials);
  }

  
  @MessagePattern({ cmd: 'ping' })
  pingIdentity() {
    return { service: 'Identity', status: 'Connected to identity_db' };
  }
}