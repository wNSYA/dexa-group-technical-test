// identity-service/src/seeder.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role/role.entity';
import { Employee } from './employee/employee.entity';
import { Account } from './account/account.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
  ) {}

  async onModuleInit() {
    console.log('Running database seeders...');
    await this.seedRoles();
    await this.seedUsers();
    console.log('Seeding complete.');
  }

  private async seedRoles() {
    const adminRole = await this.roleRepo.findOneBy({ name: 'Admin' });
    if (!adminRole) {
      await this.roleRepo.save([{ name: 'Admin' }, { name: 'Staff' }]);
      console.log('Roles seeded.');
    }
  }

  private async seedUsers() {
    const adminAccount = await this.accountRepo.findOneBy({ username: 'admin' });
    
    if (!adminAccount) {
      const adminRole = await this.roleRepo.findOneBy({ name: 'Admin' });
      const staffRole = await this.roleRepo.findOneBy({ name: 'Staff' });

      // 1. Create the Admin Employee & Account
      const adminEmployee = await this.employeeRepo.save(
        this.employeeRepo.create({ firstName: 'Super', lastName: 'Admin', division: 'Management' })
      );
      await this.accountRepo.save(
        this.accountRepo.create({
          username: 'admin',
          passwordHash: await bcrypt.hash('admin123', 10),
          role: adminRole!,
          employee: adminEmployee,
        })
      );

      // 2. Create a Mock Staff Employee & Account
      const staffEmployee = await this.employeeRepo.save(
        this.employeeRepo.create({ firstName: 'John', lastName: 'Doe', division: 'Engineering' })
      );
      await this.accountRepo.save(
        this.accountRepo.create({
          username: 'johndoe',
          passwordHash: await bcrypt.hash('staff123', 10),
          role: staffRole!,
          employee: staffEmployee,
        })
      );

      console.log('Mock users seeded (admin / admin123) & (johndoe / staff123).');
    }
  }
}