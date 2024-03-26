import {
  IsArray,
  IsBooleanString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class WorkerDto {
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsBooleanString()
  verify: boolean;

  @IsString()
  img: string;

  @IsArray()
  workerHistory: object[];
}
