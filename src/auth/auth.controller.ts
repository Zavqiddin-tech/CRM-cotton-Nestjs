import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Get('users')
  getAll() {
    return this.authService.getAllUsers();
  }
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @Post('regis')
  regis(@Body() dto: AuthDto) {
    return this.authService.regis(dto);
  }

  @HttpCode(200)
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Get('checkuser')
  checkUser(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization;
    if (token) {
      return this.authService.checkUser(token, res);
    }
  }
}
