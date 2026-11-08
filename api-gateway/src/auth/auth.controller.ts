// api-gateway/src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Inject, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject('IDENTITY_SERVICE') private identityClient: ClientProxy,
  ) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    return await lastValueFrom(
      this.identityClient.send({ cmd: 'login' }, loginDto).pipe(
        catchError((error) => throwError(() => new HttpException(error.message, HttpStatus.UNAUTHORIZED)))
      )
    );
  }

  // We moved the admin test route here too
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @Get('admin-dashboard')
  getAdminData(@Request() req) {
    return { message: 'Welcome to the admin dashboard', adminUsername: req.user.username };
  }
}