import * as Joi from '@hapi/joi';

export default () => ({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'test', 'staging', 'production')
      .default('development'),

    NODE_PORT: Joi.number()
      .port()
      .default(4000),

    IGNITE_MONGO_URL: Joi.string()
      .uri()
      .default('mongodb://localhost/test'),
  }),
});
