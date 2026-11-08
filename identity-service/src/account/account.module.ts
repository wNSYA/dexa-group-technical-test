// src/account/account.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account])], // Register repo
  exports: [TypeOrmModule], // Export repo so AuthModule can use it
})
export class AccountModule {}