import { Injectable } from '@nestjs/common';
import { WorkerDto } from './dto/worker.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Worker, WorkerDocument } from './worker.schema';
import { Model } from 'mongoose';

import { RequestWidthUser } from 'src/types/type';

@Injectable()
export class WorkerService {
  workers: WorkerDto[];

  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
  ) {}

  async getAll(req: RequestWidthUser) {
    console.log(req.userId);
    return this.workerModel.find({ user: { $eq: req.userId } });
  }

  async getById(id: string) {
    return this.workerModel.findById(id);
  }

  async createWorker(dto: WorkerDto, req: RequestWidthUser) {
    return this.workerModel.create({ ...dto, user: req.userId });
  }

  async updateWorker(dto: WorkerDto, id: string) {
    console.log(dto, id);
    return this.workerModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteWorker(id: string) {
    return this.workerModel.findByIdAndDelete(id);
  }
}
