import { Request } from 'express';

export interface RequestWidthUser extends Request {
  userId: string;
}
