// api-gateway/src/uploads/uploads.controller.ts
import { Controller, Get, Param, Res, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/uploads')
export class UploadsController {
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @Get(':filename')
  getUploadedFile(@Param('filename') filename: string, @Res() res: Response) {
    // Use process.cwd() to target the project root 'uploads' folder reliably
    const filePath = join(process.cwd(), 'uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    
    return res.sendFile(filePath);
  }
}