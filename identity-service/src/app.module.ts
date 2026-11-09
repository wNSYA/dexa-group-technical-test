import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from './role/role.entity';
import { Employee } from './employee/employee.entity';
import { Account } from './account/account.entity';
import { SeederService } from './seeder.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AccountModule } from './account/account.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    // Look one folder up to find the root .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env', 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306, // Standard MySQL port mapped in Docker
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: 'identity_db', // Explicitly use the Identity database
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, 
        timezone: 'Z',
      }),
    }),
    TypeOrmModule.forFeature([Role, Employee, Account]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // Token expires in 1 day
      }),
    }),
    AuthModule,
    EmployeeModule,
    AccountModule,
    RoleModule,
  ],
  providers: [SeederService],
})
export class AppModule {}