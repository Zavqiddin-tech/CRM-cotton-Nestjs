import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { Auth, AuthDocument } from './auth.schema';

@Injectable({})
export class AuthService {
  users: AuthDto[];

  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async getAllUsers() {
    return this.authModel.find();
  }

  async regis(dto: AuthDto) {
    const oldUser = await this.authModel.find({ email: { $eq: dto.email } });
    if (oldUser[0]) {
      return { message: 'Bu foydalanuvchi mavjud' };
    }

    const hash = await argon.hash(dto.password);
    const user = await this.authModel.create({
      email: dto.email,
      password: hash,
    });

    delete user.password;
    return user;
  }

  async login(dto: AuthDto) {
    console.log(dto);
    const user = await this.authModel.find({ email: { $eq: dto.email } });
    if (user[0]) {
      const decode = await argon.verify(user[0].password, dto.password);
      if (decode) {
        return this.generateToken(user[0].id, user[0].email);
      } else {
        return { message: 'Login yoki parol xato' };
      }
    } else {
      return { message: 'Login yoki parol xato' };
    }
  }

  async checkUser(token: string, res: Response) {
    const options = {
      secret: process.env.JWT_SECRET as string,
    };
    try {
      const decode = await this.jwt.verify(token.substring(7), options);
      if (decode) {
        console.log('token success');
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('Token muddati tugagan');
        res.status(401).json({ message: 'login parol kiriting' });
      } else {
        console.log('xatolik: ', error.message);
        res.status(401).json({ message: 'login parol kiriting' });
      }
    }
  }

  async generateToken(userId: string, email: string) {
    const payload = { userId, email };
    return {
      token: this.jwt.sign({ sub: payload.userId, username: payload.email }),
    };
  }
}
