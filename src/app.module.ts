import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { HookModule } from './hook/hook.module';
import configuration from './config/configuration';

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
    HookModule,
  ],
})
export class AppModule {}
