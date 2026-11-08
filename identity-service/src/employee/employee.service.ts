// identity-service/src/employee/employee.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { Employee } from './employee.entity';
import { Account } from '../account/account.entity';
import { Role } from '../role/role.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
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
  async createEmployee(data: any) {
    // 1. Check if username exists
    const existing = await this.accountRepo.findOneBy({ username: data.username });
    if (existing) throw new RpcException('Username is already taken');

    // 2. Fetch the requested Role
    const role = await this.roleRepo.findOneBy({ name: data.roleName });
    if (!role) throw new RpcException('Invalid role specified');

    // 3. Save Employee Profile
    const employee = await this.employeeRepo.save(
      this.employeeRepo.create({
        firstName: data.firstName,
        lastName: data.lastName,
        division: data.division,
      })
    );

    // 4. Hash password and save Account credentials
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.accountRepo.save(
      this.accountRepo.create({
        username: data.username,
        passwordHash: hashedPassword,
        role: role,
        employee: employee,
      })
    );

    return { message: 'Employee created successfully' };
  }

  async updateEmployee(accountId: number, data: { firstName?: string; lastName?: string; division?: string; roleName?: string }) {
    // 1. Find the exact account and join its relations
    const account = await this.accountRepo.findOne({
        where: { id: accountId },
        relations: { employee: true, role: true },
    });

    if (!account) throw new RpcException('Account not found');

    // 2. Update the Employee Profile details
    if (data.firstName) account.employee.firstName = data.firstName;
    if (data.lastName) account.employee.lastName = data.lastName;
    if (data.division) account.employee.division = data.division;

    // Save the changes to the employee table
    await this.employeeRepo.save(account.employee);

    // 3. Update the Role (if requested)
    if (data.roleName && account.role.name !== data.roleName) {
        const newRole = await this.roleRepo.findOneBy({ name: data.roleName });
        if (!newRole) throw new RpcException('Invalid role specified');
        
        account.role = newRole;
        await this.accountRepo.save(account);
    }

    return { message: 'Employee updated successfully' };
    }

  async getAllEmployees() {
    // Fetch accounts and join the related employee and role tables
    const accounts = await this.accountRepo.find({
      relations: { employee: true, role: true },
    });

    // Flatten the data so it's easy for React to render in a table
    return accounts.map(acc => ({
      accountId: acc.id,
      employeeId: acc.employee.id,
      firstName: acc.employee.firstName,
      lastName: acc.employee.lastName,
      division: acc.employee.division,
      username: acc.username,
      role: acc.role.name,
    }));
  }

  async deleteEmployee(accountId: number) {
    const account = await this.accountRepo.findOne({
      where: { id: accountId },
      relations: { employee: true },
    });

    if (!account) throw new RpcException('Account not found');

    // Delete account first (to remove foreign key constraints), then the employee
    const empId = account.employee.id;
    await this.accountRepo.delete(accountId);
    await this.employeeRepo.delete(empId);

    return { message: 'Employee deleted successfully' };
  }
}