import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from '../event.controller';
import { fakeHook } from '../../hook/test/util/fakeHook.util';
import { v4 } from 'uuid';
import { RegexPattern } from '../../app.constant';
import { EventService } from '../event.service';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { EVENT_QUEUE_TOKEN } from '../event.module';
import { Queue } from 'bull';

describe('Event Controller', () => {
  let controller: EventController;
  let service: EventService;
  let queue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: EVENT_QUEUE_TOKEN })],
      controllers: [EventController],
      providers: [EventService],
    }).compile();

    queue = module.get<Queue>(getQueueToken(EVENT_QUEUE_TOKEN));
    service = module.get<EventService>(EventService);
    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(queue).toBeDefined();
    expect(controller).toBeDefined();
  });

  test('.create(event) should return a new Event', async () => {
    const event = {
      event: 'hook.created',
      payload: {
        hookId: v4(),
        ...fakeHook(),
      },
    };

    jest.spyOn(service, 'createEvent').mockImplementationOnce(
      jest.fn(async () => ({
        eventId: v4(),
        timestamp: new Date().toISOString(),
        data: event.payload,
        event: event.event,
      })),
    );

    const result = await controller.create(event);

    expect(result.eventId).toMatch(RegexPattern.Uuid);
    delete result.eventId;

    expect(result.data).toEqual(event.payload);
    expect(result.event).toBe(event.event);
    expect(result.timestamp).toBeDefined();

    expect(service.createEvent).toHaveBeenCalledTimes(1);
    expect(service.createEvent).toHaveBeenCalledWith(event);
  });

  afterEach(async () => await queue.close());
});
