import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from "bcrypt";
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async getTokens(userId: number, email: string) {
    const accessToken = await this.jwtService.sign({ userId, email }, {
      expiresIn: 60 * 15,
      secret: "at-secret"
    })
    const refreshToken = await this.jwtService.sign({ userId, email }, {
      expiresIn: 86400 * 7,
      secret: "rt-secret"
    })
    return { accessToken, refreshToken }
  }

  async updateHash(refreshToken: string, userId: number) {
    const hash = await bcrypt.hash(refreshToken, 10);
    const user = await this.prisma.user.update({ where: { id: userId }, data: { hashRt: hash } })
    return user;
  }


  async signupLocal(signUpDto: SignUpDto): Promise<Tokens> {
    try {
      const hash = await bcrypt.hash(signUpDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: signUpDto.email,
          hash
        }
      })
      const { accessToken, refreshToken } = await this.getTokens(user.id, user.email)
      this.updateHash(refreshToken, user.id)
      return { access_token: accessToken, refresh_token: refreshToken }
    }
    catch (e) {
      throw new HttpException("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }



  async signinLocal(signinDto: SignInDto): Promise<Tokens> {
    const user = await this.getUserByEmail(signinDto.email)
    if (!user) {
      throw new NotFoundException("User with above credentials doesnt exist")
    }
    const isMatch = await bcrypt.compare(signinDto.password, user.hash);
    if (!isMatch) {
      throw new NotFoundException("User with above credentials doesnt exist")
    }
    const { accessToken, refreshToken } = await this.getTokens(user?.id, user?.email);
    await this.updateHash(refreshToken, user.id)
    return {
      access_token: accessToken, refresh_token: refreshToken
    }
  }


  async logout(id: number) {
    try {
      await this.prisma.user.updateMany({
        where: {
          id,
          hashRt: {
            not: null
          }
        },
        data: {
          hashRt: null
        }
      })
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async refresh(id: number, rt: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new UnauthorizedException();
      console.log("user", user)
      const rtMatches = await bcrypt.compare(rt, user.hashRt)
      if (!rtMatches) throw new UnauthorizedException();
      const { accessToken, refreshToken } = await this.getTokens(id, user.email);
      await this.updateHash(refreshToken, id)
      return { accessToken, refreshToken }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } })
  }

}
