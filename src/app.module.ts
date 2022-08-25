import { RedisModule } from '@common/cache/redis/redis.module';
import { loadConfig } from '@infra/config/load.config';
import { ThrottlerFactoryConfig } from '@infra/config/throttler-factory.config';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from './core/guards/auth.guard';
import { AppInterceptor } from './core/interceptors';
import { HealthModule, MarvelModule, TaskModule, UserModule } from './modules';
import { AuthModule } from './modules/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfig],
    }),
    //Http request
    HttpModule,
    //Rate limit
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: ThrottlerFactoryConfig,
    }),
    //Cache module
    RedisModule,
    //App modules
    AuthModule,
    HealthModule,
    UserModule,
    TaskModule,
    //Libs
    MarvelModule,
  ],
  providers: [
    {
      /**
       * Use an interceptor to set default response { data }
       */
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      /**
       * Rate Limiting
       *
       * Set the global options for the ttl, the time to live, and the limit,
       *
       * the maximum number of requests within the ttl, for the routes of your application that are guarded.
       *
       * Customization#
       *
       * There may be a time where you want to bind the guard to a controller or globally, but want to disable rate limiting for one or more of your endpoints.
       *
       * For that, you can use the @SkipThrottle() decorator, to negate the throttler for an entire class or a single route.
       *
       * The @SkipThrottle() decorator can also take in a boolean for if there is a case where you want to exclude most of a controller, but not every route.
       *
       * Use on top of method @SkipThrottle(false)
       *
       * Override default configuration for Rate limiting and duration @Throttle(3, 60)
       */
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      /**
       * The vast majority of endpoints should be protected by default
       *
       * Register the authentication guard as a global guard and instead of using @UseGuards(JwtAuthGuard)
       *
       * Decorator on top of each controller, you could simply flag which routes should be public using @Public()
       *
       */
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      /**
       * All enpoints should be protected with roles using @Roles()
       */
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
