import { Module } from '@nestjs/common';
import { HookController } from './hook.controller';
import { HookService } from './hook.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HookSchema } from './schema/hook.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Webhook', schema: HookSchema }]),
  ],
  controllers: [HookController],
  providers: [HookService],
  exports: [MongooseModule, HookService],
})
export class HookModule {}
