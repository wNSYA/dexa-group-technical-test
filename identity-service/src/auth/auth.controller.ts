import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  login(@Payload() credentials: any) {
    return this.authService.login(credentials);
  }

  @MessagePattern({ cmd: 'ping' })
  pingIdentity() {
    return { service: 'Identity', status: 'Connected to identity_db' };
  }
}