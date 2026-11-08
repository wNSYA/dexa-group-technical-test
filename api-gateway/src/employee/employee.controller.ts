// api-gateway/src/employee/employee.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Inject, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Roles('Admin') 
@Controller('api/employees')
export class EmployeeController {
  constructor(
    @Inject('IDENTITY_SERVICE') private identityClient: ClientProxy,
  ) {}

  @Post()
  async createEmployee(@Body() body: any) {
    return await lastValueFrom(
      this.identityClient.send({ cmd: 'create_employee' }, body).pipe(
        catchError(error => throwError(() => new HttpException(error.message, HttpStatus.BAD_REQUEST)))
      )
    );
  }

  @Patch(':id')
  async updateEmployee(@Param('id') accountId: string, @Body() body: any) {
    return await lastValueFrom(
      this.identityClient.send(
        { cmd: 'update_employee' }, 
        { id: Number(accountId), data: body } // Combine ID and body into one TCP payload
      ).pipe(
        catchError(error => throwError(() => new HttpException(error.message, HttpStatus.BAD_REQUEST)))
      )
    );
  }

  @Get()
  async getAllEmployees() {
    return await lastValueFrom(
      this.identityClient.send({ cmd: 'get_all_employees' }, {}).pipe(
        catchError(error => throwError(() => new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)))
      )
    );
  }

  @Delete(':id')
  async deleteEmployee(@Param('id') accountId: string) {
    return await lastValueFrom(
      this.identityClient.send({ cmd: 'delete_employee' }, Number(accountId)).pipe(
        catchError(error => throwError(() => new HttpException(error.message, HttpStatus.BAD_REQUEST)))
      )
    );
  }
}