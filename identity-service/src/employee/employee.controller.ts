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

    @MessagePattern({ cmd: 'create_employee' })
    create(@Payload() data: any) {
        return this.employeeService.createEmployee(data);
    }

    @MessagePattern({ cmd: 'update_employee' })
    update(@Payload() payload: { id: number; data: any }) {
        return this.employeeService.updateEmployee(payload.id, payload.data);
    }

    @MessagePattern({ cmd: 'get_all_employees' })
    getAll() {
        return this.employeeService.getAllEmployees();
    }

    @MessagePattern({ cmd: 'delete_employee' })
    delete(@Payload() accountId: number) {
        return this.employeeService.deleteEmployee(accountId);
    }
}