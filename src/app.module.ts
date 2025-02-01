import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards/At.guard';


@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [],
 
})
export class AppModule {}
