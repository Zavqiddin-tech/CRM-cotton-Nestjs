import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
  Req,
  UseInterceptors,
  UploadedFile,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWidthUser } from 'src/types/type';
import * as path from 'path';
import * as fs from 'fs';

import { AuthGuard } from 'src/Guard/auth.guard';
import { WorkerDto } from './dto/worker.dto';
import { diskStorage } from 'multer';
import { WorkerHistoryDto } from './dto/history.dto';

@Controller('workers')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Req() req: RequestWidthUser) {
    return this.workerService.getAll(req);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.workerService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../../uploads',
      }),
    }),
  )
  async createWorker(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: WorkerDto,
    @Req() req: RequestWidthUser,
  ) {
    console.log(dto);
    if (!file) {
      throw new Error('File is required');
    }

    // Fayl kengaytmasini aniqlash
    const fileExtension = path.extname(file.originalname);
    const newFileName = file.filename + fileExtension;
    const destination = path.join('uploads', newFileName);

    const readStream = fs.createReadStream(file.path);
    const writeStream = fs.createWriteStream(destination);
    readStream.pipe(writeStream);

    return this.workerService.createWorker({ ...dto, img: newFileName }, req);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../../uploads',
      }),
    }),
  )
  async updateWorker(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() dto: WorkerDto,
  ) {
    if (file) {
      fs.unlink(`uploads/${dto.img}`, (err) => {
        if (err) {
          throw new Error('Failed to delete file');
        }
        console.log('File deleted successfully');
      });
      // Fayl kengaytmasini aniqlash
      const fileExtension = path.extname(file.originalname);
      const newFileName = file.filename + fileExtension;
      const destination = path.join('uploads', newFileName);

      const readStream = fs.createReadStream(file.path);
      const writeStream = fs.createWriteStream(destination);
      readStream.pipe(writeStream);
      return this.workerService.updateWorker({ ...dto, img: newFileName }, id);
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

  //* work history add
  @Post('workerhistory/:id')
  @UseGuards(AuthGuard)
  async createWorkerHistory(
    @Param('id') id: string,
    @Body() dto: WorkerHistoryDto,
  ) {
    return this.workerService.createWorkerHistory(id, dto);
  }

  // @Put('workerhistory/:id')
  // @UseGuards(AuthGuard)
  // async updateWorkerHistory(
  //   @Param('id') id: string,
  //   @Body() dto: WorkerHistoryDto,
  // ) {
  //   return this.workerService.updateWorkerHistory(id, dto);
  // }
}
