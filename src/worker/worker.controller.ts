import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWidthUser } from 'src/types/type';
import * as fs from 'fs';

import { AuthGuard } from 'src/Guard/auth.guard';
import { WorkerDto } from './dto/worker.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { WorkerHistoryDto } from './dto/history.dto';
import { PaidHistoryDto } from './dto/paid-history';
import { CalendarDto } from './dto/calendar.dto';

@Controller('workers')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Req() req: RequestWidthUser) {
    return this.workerService.getAll(req);
  }

  @Get('calendarDto')
  @UseGuards(AuthGuard)
  async getAllWorks(@Req() req: RequestWidthUser) {
    return this.workerService.getAllWorks(req);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.workerService.getById(id);
  }

  @Post('calendar-work')
  @UseGuards(AuthGuard)
  async calendarWork(@Body() dto: CalendarDto, @Req() req: RequestWidthUser) {
    return this.workerService.calendarWork(dto, req);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', {}))
  async createWorker(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: WorkerDto,
    @Req() req: RequestWidthUser,
  ) {
    // if (!file) {
    //   throw new Error('File is required');
    // }

    return this.workerService.createWorker({
      ...dto,
      img: file ? file.filename : '',
      user: req.userId,
    });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', {}))
  async updateWorker(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() dto: CreateWorkerDto,
  ) {
    if (file) {
      fs.unlink(`uploads/${dto.img}`, (err) => {
        if (err) {
          throw new Error('Failed to delete file');
        }
        console.log('File deleted successfully');
      });

      return this.workerService.updateWorker(
        { ...dto, img: file.filename },
        id,
      );
    }
    if (!file) {
      return this.workerService.updateWorker({ ...dto }, id);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteWorker(@Param('id') id: string) {
    return this.workerService.deleteWorker(id);
  }

  //* verify
  @Put('worker-verify/:id')
  @UseGuards(AuthGuard)
  async changeVerify(
    @Param('id') id: string,
    @Body() dto: { verify: boolean },
  ) {
    return this.workerService.changeVerify(id, dto);
  }

  //* work history add
  @Post('work-history/:id')
  @UseGuards(AuthGuard)
  async createWorkerHistory(
    @Param('id') id: string,
    @Body() dto: WorkerHistoryDto,
  ) {
    return this.workerService.createWorkerHistory(id, dto);
  }

  //* work history update
  @Put(':id/work-history/:workId')
  @UseGuards(AuthGuard)
  async updateWorkerHistory(
    @Param('id') workerId: string,
    @Param('workId') workHistoryId: string,
    @Body() dto: WorkerHistoryDto,
  ) {
    return this.workerService.updateWorkerHistory(workerId, workHistoryId, dto);
  }

  @Put(':id/paid-history')
  async paid(@Param('id') workerId: string, @Body() dto: PaidHistoryDto[]) {
    return this.workerService.paid(workerId, dto);
  }
}
