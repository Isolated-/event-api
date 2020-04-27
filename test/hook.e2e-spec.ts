import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { fakeHook } from '../src/hook/test/util/fakeHook.util';
import { TransformInterceptor } from '../src/transform.interceptor';
import { BullModule } from '@nestjs/bull';
import { EVENT_QUEUE_TOKEN } from '../src/event/event.module';

describe('HookController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        BullModule.registerQueue({ name: EVENT_QUEUE_TOKEN }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  test('/hook (POST) should return 400 (BadRequest)', () => {
    return request(app.getHttpServer())
      .post('/hook')
      .send(undefined)
      .expect(400);
  });

  test('/hook (POST) should return 201 (Created)', () => {
    const hook = fakeHook();

    return request(app.getHttpServer())
      .post('/hook')
      .send(hook)
      .expect(201)
      .then(response => {
        const data = response.body;

        expect(data.hookId).toMatch(
          /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/,
        );

        expect(data._id).not.toBeDefined();
        expect(data.__v).not.toBeDefined();

        delete data.hookId;

        expect(data).toEqual(hook);
      });
  });

  test.todo('test 401 and 403 responses from failed authentication');

  afterAll(async () => await app.close());
});
