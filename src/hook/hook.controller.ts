import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Hook } from '../interface/hook.interface';
import { CreateHookDto } from './dto/create-hook.dto';
import { HookService } from './hook.service';

@Controller('hook')
export class HookController {
  constructor(private readonly hook: HookService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateHookDto): Promise<Hook> {
    let copy = dto;

    copy.event =
      typeof copy.event === 'string'
        ? String(copy.event).split(',')
        : copy.event;

    return this.hook.createHook(copy);
  }
}
