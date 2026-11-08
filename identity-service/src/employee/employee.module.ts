// identity-service/src/employee/employee.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.entity';
import { AccountModule } from '../account/account.module'; 
import { RoleModule } from '../role/role.module';         

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    AccountModule,
    RoleModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService]
})
export class EmployeeModule {}