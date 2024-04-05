import { Injectable } from '@nestjs/common';
import { WorkerDto } from './dto/worker.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Worker, WorkerDocument } from './worker.schema';
import { Model } from 'mongoose';
import { RequestWidthUser } from 'src/types/type';
import { WorkerHistoryDto } from './dto/history.dto';
@Injectable()
export class WorkerService {
  workers: WorkerDto[];

  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
  ) {}

  async getAll(req: RequestWidthUser) {
    return this.workerModel.find({ user: { $eq: req.userId } });
  }

  async getById(id: string) {
    return this.workerModel.findById(id);
  }

  async createWorker(dto: WorkerDto, req: RequestWidthUser) {
    return this.workerModel.create({
      ...dto,
      user: req.userId,
    });
  }

  async updateWorker(dto: WorkerDto, id: string) {
    return this.workerModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteWorker(id: string) {
    return this.workerModel.findByIdAndDelete(id);
  }

  async createWorkerHistory(id: string, dto: WorkerHistoryDto) {
    console.log(id, dto);
    await this.workerModel.updateOne(
      { _id: id },
      {
        $push: {
          workHistory: {
            kg: dto.kg,
            money: dto.money,
            date: dto.date,
          },
        },
      },
    );
    return this.workerModel.findById(id);
  }

  // async updateWorkerHistory(id: string, dto: WorkerHistoryDto) {
  //   console.log(id, dto);
  //   await this.workerModel.updateOne(
  //     { _id: id, 'workHistory._id': dto._id },
  //     { $set: { 'workHistory.$': dto } },
  //   );
  //   return this.workerModel.findById(id);
  // }
}
