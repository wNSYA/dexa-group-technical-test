import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'ping' })
  pingIdentity() {
    return { service: 'Identity', status: 'Connected to identity_db' };
  }
}