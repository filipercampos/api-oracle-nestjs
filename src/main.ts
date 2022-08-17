import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeMiddlewares } from './core/middlewares/app.middleware';

const logger = new Logger('Main');

/**
 * Start app
 */
async function bootstrap() {
  //insights
  // require('newrelic');

  //create app
  const app = await NestFactory.create(AppModule);

  //config middlwares
  initializeMiddlewares(app);

  //start app
  await app.listen(process.env.PORT, () =>
    logger.log(
      `API running port ${process.env.PORT} environment: ${process.env.ENV} `,
    ),
  );
}

//run app
bootstrap();
