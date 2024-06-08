import { Injectable } from '@nestjs/common';
import { WorkerDto } from './dto/worker.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Worker, WorkerDocument } from './worker.schema';
import { Model } from 'mongoose';
import { RequestWidthUser } from 'src/types/type';
import { WorkerHistoryDto } from './dto/history.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { PaidHistoryDto } from './dto/paid-history';
import { CalendarDto } from './dto/calendar.dto';
import * as fs from 'fs';

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

  // Calendar works
  async calendarWork(dto: CalendarDto, req: RequestWidthUser) {
    const works = await this.workerModel.find({ user: { $eq: req.userId } });
    const filteredWork: WorkerHistoryDto[] = [];
    await works.forEach((work) => {
      return work.workHistory.forEach((item) => {
        if (
          new Date(item.date).getDate() == dto.day &&
          new Date(item.date).getMonth() + 1 == dto.month &&
          new Date(item.date).getFullYear() == dto.year
        ) {
          filteredWork.push(item);
        }
      });
    });
    return filteredWork;
  }

  // All works
  async getAllWorks(req: RequestWidthUser) {
    const works = await this.workerModel.find({ user: { $eq: req.userId } });
    const filteredWork: WorkerHistoryDto[] = [];
    await works.forEach((work) => {
      return work.workHistory.forEach((item) => {
        filteredWork.push(item);
      });
    });
    return filteredWork;
  }

  async createWorker(dto: CreateWorkerDto) {
    return this.workerModel.create(dto);
  }

  async updateWorker(dto: CreateWorkerDto, id: string) {
    return this.workerModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteWorker(id: string) {
    const res = await this.workerModel.findById(id);
    if (res.img) {
      fs.unlink(`uploads/${res.img}`, (err) => {
        if (err) {
          throw new Error('Failed to delete file');
        }
        console.log('File deleted successfully');
      });
    }
    return this.workerModel.findByIdAndDelete(id);
  }

  async changeVerify(id: string, dto: { verify: boolean }) {
    await this.workerModel.updateOne(
      { _id: id },
      { $set: { verify: !dto.verify } },
    );
    return this.workerModel.findById(id);
  }

  async createWorkerHistory(id: string, dto: WorkerHistoryDto) {
    await this.workerModel.updateOne(
      { _id: id },
      {
        $push: {
          workHistory: {
            kg: dto.kg,
            paid: dto.paid,
            status: dto.status,
            date: dto.date,
          },
        },
      },
    );
    return this.workerModel.findById(id);
  }

  // terilgan paxtani yangilash
  async updateWorkerHistory(
    workerId: string,
    workHistoryId: string,
    dto: WorkerHistoryDto,
  ) {
    await this.workerModel.updateOne(
      { _id: workerId, 'workHistory._id': workHistoryId },
      { $set: { 'workHistory.$': dto } },
    );

    return this.workerModel.findById(workerId);
  }

  // paxtani pulini to'lash qismi
  async paid(workerId: string, dto: PaidHistoryDto[]) {
    const updatePromise = dto.map(async (item) => {
      await this.workerModel.updateOne(
        { _id: workerId, 'workHistory._id': item._id },
        {
          $set: {
            'workHistory.$': {
              ...item,
              paid: true,
            },
          },
        },
      );
    });

    await Promise.all(updatePromise);

    return this.workerModel.findById(workerId);
  }
}
