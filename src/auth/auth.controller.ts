import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Request, Response } from 'express';
import { AtGuard } from './guards/At.guard';
import { RtGuard } from './guards/rt.guard';
import { User } from './decorators/user.decorator';
import { Payload } from './types/payload.type';
import { Rt } from './types/rt.type';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/local/signup')
    @UsePipes(ValidationPipe)
    
    signupLocal(@Body() signUpDto:SignUpDto) {
       return this.authService.signupLocal(signUpDto)
    }

    @Post('/local/signin')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    signinLocal(@Body() signinDto:SignInDto) {
       return this.authService.signinLocal(signinDto)
    }

    @Post('/logout')
    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    logout(@Req() req:Request,@Res() res:Response,@User('userId') userId:number) {
        this.authService.logout(userId);
       return res.status(204).send();
    }

    @Post('/refresh')
    @UseGuards(RtGuard)
    refresh(@Req() request:Request,@User('refreshToken') refreshToken:string,@User('userId') userId:number) {
      
        console.log("refresh token",refreshToken)
        console.log("userid",userId)
        return this.authService.refresh(userId,refreshToken)
    }

    @Get("/:email")
    @Public()
    getUserByEmail(@Param("email")email:string){
        const user=this.authService.getUserByEmail(email);
        if(!user){
            throw new NotFoundException("User not found")
        }
        return user;
    }
}
