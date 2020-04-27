import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EVENT_QUEUE_TOKEN } from './event.module';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from '../interface/event.interface';

@Injectable()
export class EventService {
  constructor(@InjectQueue(EVENT_QUEUE_TOKEN) private readonly queue: Queue) {}

  async createEvent(dto: CreateEventDto): Promise<Event<any>> {
    const event = {
      eventId: v4(),
      data: dto.payload,
      event: dto.event,
      timestamp: new Date().toISOString(),
    };

    await this.queue.add('ignite.event', event);

    return event;
  }
}
