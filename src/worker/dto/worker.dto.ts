import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WorkerHistoryDto } from './history.dto';

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

  @ValidateNested({ each: true })
  @Type(() => WorkerHistoryDto)
  workHistory: WorkerHistoryDto[];
}
