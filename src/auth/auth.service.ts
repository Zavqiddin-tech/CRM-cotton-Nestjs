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
    return await this.authModel.find({ session: { $eq: 'farmer' } });
  }

  async getOneFarmer(id: string) {
    return await this.authModel.findById(id).select('-password');
  }

  async changeStatusFarmer(id: string) {
    const farmer = await this.authModel.findById(id);
    await this.authModel.findByIdAndUpdate(
      farmer.id,
      { status: !farmer.status },
      { new: true },
    );
    return await this.authModel.find({ session: { $eq: 'farmer' } });
  }

  async updateFarmer(id: string, dto: AuthDto) {
    if (dto.password) {
      const hash = await argon.hash(dto.password);
      await this.authModel.findByIdAndUpdate(
        id,
        { ...dto, password: hash },
        { new: true },
      );
      return await this.authModel.find({ session: { $eq: 'farmer' } });
    }

    await this.authModel.findByIdAndUpdate(id, { dto });
    return await this.authModel.find({ session: { $eq: 'farmer' } });
  }

  async deleteUser(id: string) {
    await this.authModel.findByIdAndDelete(id);
  }

  // Authorization
  async regis(dto: AuthDto) {
    const admin = await this.authModel.find({ session: { $eq: dto.session } });
    if (admin[0] && admin[0].session === 'admin') {
      return { message: 'mumkin emas' };
    }
    const oldUser = await this.authModel.find({ email: { $eq: dto.email } });
    if (oldUser[0]) {
      return { message: 'Bu foydalanuvchi mavjud' };
    }

    const hash = await argon.hash(dto.password);
    await this.authModel.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      date: dto.date,
      status: dto.status,
      email: dto.email,
      password: hash,
      session: dto.session,
    });

    return await this.authModel.find({ session: { $eq: dto.session } });
  }

  async login(dto: AuthDto) {
    const user = await this.authModel.find({ email: { $eq: dto.email } });
    if (user[0]) {
      if (user[0].session === 'admin') {
        const decode = await argon.verify(user[0].password, dto.password);
        if (decode) {
          return this.generateToken(user[0].id, user[0].email);
        } else {
          return { message: 'Login yoki parol xato' };
        }
      } else {
        const decode = await argon.verify(user[0].password, dto.password);
        if (decode && user[0].status == 1) {
          return this.generateToken(user[0].id, user[0].email);
        }
        if (decode && user[0].status == 0) {
          return { message: "kirish huquqi yo'q" };
        } else {
          return { message: 'Login yoki parol xato' };
        }
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

  async checkAdmin(token: string, res: Response) {
    const options = {
      secret: process.env.JWT_SECRET as string,
    };
    try {
      const decode = await this.jwt.verify(token.substring(7), options);
      const admin = await this.authModel.findById(decode.sub);
      if (admin.session === 'admin') {
      } else {
        res.status(401).json({ message: 'sizga ruxsat berilmaydi' });
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
      user: email,
    };
  }
}
