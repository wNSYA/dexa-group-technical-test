// identity-service/src/app.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Account } from './account.entity';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    private jwtService: JwtService,
  ) {}

  async login(credentials: { username: string; password: string }) {
    // 1. Find the account and join the Role and Employee data
    const account = await this.accountRepo.findOne({
      where: { username: credentials.username },
      relations: {
      role: true,
      employee: true,
    },
    });

    if (!account) {
      throw new RpcException('Invalid credentials');
    }

    // 2. Verify the password
    const isPasswordValid = await bcrypt.compare(credentials.password, account.passwordHash);
    
    if (!isPasswordValid) {
      throw new RpcException('Invalid credentials');
    }

    // 3. Generate the JWT Payload
    const payload = {
      sub: account.id,
      employeeId: account.employee.id,
      username: account.username,
      role: account.role.name,
      jti: uuidv4(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      employee: {
        firstName: account.employee.firstName,
        lastName: account.employee.lastName,
        role: account.role.name,
      }
    };
  }
}