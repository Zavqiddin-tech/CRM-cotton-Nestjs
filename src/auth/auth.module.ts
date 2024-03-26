import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const options = {
  secret: process.env.JWT_SECRET as string,
};

@Module({
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.register({
      global: true,
      secret: options.secret,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot(),
  ],
})
export class AuthModule {}
