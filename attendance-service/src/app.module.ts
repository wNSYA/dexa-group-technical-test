import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
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
        port: 3307, // Use 3307 to target the Attendance DB container
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: 'attendance_db', // Explicitly use the Attendance database
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        timezone: 'Z',
      }),
    }),
    AttendanceModule,
  ],
})
export class AppModule {}