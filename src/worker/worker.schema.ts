import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Owner, OwnerSchema } from './owner.schema';

export type WorkerDocument = HydratedDocument<Worker>;

@Schema()
export class Worker {
  @Prop()
  user: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  verify: boolean;

  @Prop()
  img: string;

  @Prop({ type: [OwnerSchema] })
  workHistory: Owner[];
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
