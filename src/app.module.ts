import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { HookModule } from './hook/hook.module';
import { EventModule, EVENT_QUEUE_TOKEN } from './event/event.module';
import configuration from './config/configuration';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot(configuration()),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('IGNITE_MONGO_URL'),
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          name: EVENT_QUEUE_TOKEN,
          redis: {
            host: config.get('IGNITE_REDIS_HOST'),
            port: config.get('IGNITE_REDIS_PORT'),
          },
        };
      },
      inject: [ConfigService],
    }),
    HookModule,
    EventModule,
  ],
})
export class AppModule {}
