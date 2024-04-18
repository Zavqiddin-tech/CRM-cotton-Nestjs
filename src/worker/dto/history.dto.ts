import { IsNotEmpty, IsBoolean, IsNumber, IsString } from 'class-validator';

export class WorkerHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  kg: number;

  @IsNotEmpty()
  @IsBoolean()
  paid: boolean;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsString()
  date: string;
}
