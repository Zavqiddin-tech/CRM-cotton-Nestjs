import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Worker, WorkerSchema } from './worker.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService],
  imports: [
    MongooseModule.forFeature([{ name: Worker.name, schema: WorkerSchema }]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
})
export class WorkerModule {}
