import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Owner extends Document {
  @Prop()
  kg: number;

  @Prop()
  paid: boolean;

  @Prop()
  status: number;

  @Prop()
  date: string;
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);
