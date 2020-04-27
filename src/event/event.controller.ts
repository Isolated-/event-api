import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { Event } from '../interface/event.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { v4 } from 'uuid';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly service: EventService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateEventDto): Promise<Event<any>> {
    return this.service.createEvent(dto);
  }
}
