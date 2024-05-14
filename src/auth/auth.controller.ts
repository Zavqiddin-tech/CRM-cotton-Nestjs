import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

  @Get('users')
  getAll() {
    return this.authService.getAllUsers();
  }

  @Get('users/:id')
  getOneFarmer(@Param('id') id: string) {
    return this.authService.getOneFarmer(id);
  }

  // update status
  @Put('users/status/:id')
  changeStatusFarmer(@Param('id') id: string) {
    return this.authService.changeStatusFarmer(id);
  }

  // update full
  @Put('users/:id')
  updateFarmer(@Param('id') id: string, @Body() dto: AuthDto) {
    return this.authService.updateFarmer(id, dto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  // Authorization
  @UsePipes(ValidationPipe)
  @Post('regis')
  regis(@Body() dto: AuthDto) {
    return this.authService.regis(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Get('checkadmin')
  checkAdmin(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization;
    if (token) {
      return this.authService.checkAdmin(token, res);
    }
  }

  @Get('checkuser')
  checkUser(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization;
    if (token) {
      return this.authService.checkUser(token, res);
    }
  }
}
