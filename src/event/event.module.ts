import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EventController } from './event.controller';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { EventService } from './event.service';

export const EVENT_QUEUE_TOKEN = 'ignite.event';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
