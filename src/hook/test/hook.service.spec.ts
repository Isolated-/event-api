import { Test, TestingModule } from '@nestjs/testing';
import { HookService } from '../hook.service';
import { fakeHook } from './util/fakeHook.util';
import { v4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { getModelToken } from '@nestjs/mongoose';
import { Hook } from 'src/interface/hook.interface';
import { Model } from 'mongoose';

class FakeModel {
  constructor(private data) {}
  save = jest
    .fn()
    .mockResolvedValue({ _id: new ObjectId(), hookId: v4(), ...this.data });
}

describe('HookService', () => {
  let service: HookService;
  let model: Model<Hook>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('.createHook(hook) should create and return a Hook', async () => {
    const hook = fakeHook();

    const result = await service.createHook(hook);

    // TODO: change this to use .toMatch(uuidRegex) when uuid is implemented
    expect(result._id).toBeDefined();
    expect(result.hookId).toMatch(
      /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/,
    );

    delete result._id;
    delete result.hookId;

    expect(result).toEqual(hook);
  });
});
