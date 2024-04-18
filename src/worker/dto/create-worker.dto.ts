import { WorkerHistoryDto } from './history.dto';

export class CreateWorkerDto {
  user: string;
  img: string;
  firstName: string;
  lastName: string;
  verify: boolean;
  date: string;
  workHistory: WorkerHistoryDto[];
}
