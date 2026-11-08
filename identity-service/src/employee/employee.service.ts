// identity-service/src/employee/employee.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // Import 'In'
import { Employee } from './employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  async getEmployeesByIds(ids: number[]) {
    if (!ids || ids.length === 0) return [];
    
    return await this.employeeRepo.find({
      where: { id: In(ids) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        division: true,
      },
    });
  }
}