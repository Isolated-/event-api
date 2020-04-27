import { v4 } from 'uuid';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateHookDto } from './dto/create-hook.dto';
import { Hook } from '../interface/hook.interface';

@Injectable()
export class HookService {
  constructor(@InjectModel('Webhook') private readonly model: Model<Hook>) {}

  async createHook(dto: CreateHookDto): Promise<Hook> {
    const doc = new this.model(dto);

    doc.hookId = v4();

    return doc.save();
  }
}
