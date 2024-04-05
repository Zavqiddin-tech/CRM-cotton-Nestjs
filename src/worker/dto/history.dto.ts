import { IsNotEmpty, IsBoolean, IsNumber, IsString } from 'class-validator';

export class WorkerHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  kg: number;

  @IsNotEmpty()
  @IsBoolean()
  money: boolean;

  @IsNotEmpty()
  @IsString()
  date: string;
}
