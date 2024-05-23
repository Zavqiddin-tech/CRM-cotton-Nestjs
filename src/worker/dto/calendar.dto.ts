import { IsNotEmpty, IsNumber } from 'class-validator';

export class CalendarDto {
  @IsNotEmpty()
  @IsNumber()
  day: number;

  @IsNotEmpty()
  @IsNumber()
  month: number;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}
