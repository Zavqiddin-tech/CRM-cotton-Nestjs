import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const options = {
      secret: process.env.JWT_SECRET as string,
    };

    const token = request.headers.authorization;
    try {
      const decode = this.jwt.verify(token.substring(7), options);
      if (decode) {
        request.userId = decode.sub;
        return true;
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('Token muddati tugagan');
        response.status(401).json({ message: 'login parol kiriting' });
        return false;
      } else {
        console.log('xatolik: ', error.message);
        response.status(401).json({ message: 'login parol kiriting' });
        return false;
      }
    }
  }
}
