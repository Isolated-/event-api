import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../event.service';
import { v4 } from 'uuid';
import { fakeHook } from '../../hook/test/util/fakeHook.util';
import { RegexPattern } from '../../app.constant';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { EVENT_QUEUE_TOKEN } from '../event.module';
import { Queue } from 'bull';

describe('EventService', () => {
  let service: EventService;
  let queue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: EVENT_QUEUE_TOKEN })],
      providers: [EventService],
    }).compile();

    queue = module.get<Queue>(getQueueToken(EVENT_QUEUE_TOKEN));
    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('.createEvent(event) should return a new Event', async () => {
    const event = {
      event: 'hook.created',
      payload: {
        hookId: v4(),
        ...fakeHook(),
      },
    };

    const created = {
      eventId: v4(),
      timestamp: new Date().toISOString(),
      ...event,
    };

    jest.spyOn(queue, 'add').mockImplementationOnce(
      jest.fn(
        async () =>
          ({
            id: '1',
            data: {
              ...created,
            },
            opts: {
              attempts: 1,
            },
            attemptsMade: 0,
            queue,
          } as any),
      ),
    );
    const result = await service.createEvent(event);

    expect(result.eventId).toMatch(RegexPattern.Uuid);
    delete result.eventId;

    expect(result.data).toEqual(event.payload);
    expect(result.event).toBe(event.event);
    expect(result.timestamp).toBeDefined();

    expect(queue.add).toHaveBeenCalledTimes(1);
  });

  afterEach(async () => await queue.close());
});
