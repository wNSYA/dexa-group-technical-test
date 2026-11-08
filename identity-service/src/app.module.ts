import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Role } from './role.entity';
import { Employee } from './employee.entity';
import { Account } from './account.entity';
import { SeederService } from './seeder.service';

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
      }),
    }),
    TypeOrmModule.forFeature([Role, Employee, Account]),
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}