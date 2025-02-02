import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
imports:[JwtModule.register({
})],
  providers: [AuthService,AtStrategy,RtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
