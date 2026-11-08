// identity-service/src/employee/employee.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmployeeService } from './employee.service';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Add this new message pattern:
  @MessagePattern({ cmd: 'get_employees_by_ids' })
  getEmployeesByIds(@Payload() ids: number[]) {
    return this.employeeService.getEmployeesByIds(ids);
  }
}