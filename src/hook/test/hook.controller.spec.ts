import { Test, TestingModule } from '@nestjs/testing';
import { HookController } from '../hook.controller';
import { HookService } from '../hook.service';
import { fakeHook } from './util/fakeHook.util';
import { v4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { HookSchema } from '../schema/hook.schema';
import { Model } from 'mongoose';
import { Hook } from 'src/interface/hook.interface';

class FakeModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
}

describe('Hook Controller', () => {
  let controller: HookController;
  let service: HookService;
  let model: Model<Hook>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [HookController],
      providers: [
        HookService,
        {
          provide: getModelToken('Webhook'),
          useValue: FakeModel,
        },
      ],
    }).compile();

    model = module.get<Model<Hook>>(getModelToken('Webhook'));
    service = module.get<HookService>(HookService);
    controller = module.get<HookController>(HookController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  test('.create(hook) should return a new Hook', async () => {
    const hook = fakeHook();

    jest
      .spyOn(service, 'createHook')
      .mockImplementationOnce(
        jest.fn(
          async () => ({ id: new ObjectId(), hookId: v4(), ...hook } as Hook),
        ),
      );

    const result = await controller.create(hook);

    delete result.id;
    delete result.hookId;

    expect(result).toEqual(hook);

    expect(service.createHook).toBeCalledTimes(1);
    expect(service.createHook).toBeCalledWith(hook);
  });

  test('.create(hook) should convert event from string to array (if required)', async () => {
    let hook: any = fakeHook();
    hook.event = hook.event.join(',');

    jest
      .spyOn(service, 'createHook')
      .mockImplementationOnce(
        jest.fn(
          async () =>
            ({ id: new ObjectId(), hookId: v4(), ...fakeHook() } as Hook),
        ),
      );

    const result = await controller.create(hook);

    delete result.id;
    delete result.hookId;

    expect(result).toEqual(fakeHook());

    expect(service.createHook).toHaveBeenCalledTimes(1);
    expect(service.createHook).toHaveBeenCalledWith(fakeHook());
  });
});
