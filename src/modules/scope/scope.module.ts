import { Module } from '@nestjs/common';
import { IScopeUsecase } from './interfaces/iscope.usecase';
import { ScopeRepository } from './repositories/scope.repository';
import { ScopeController } from './scope.controller';
import { ScopeService } from './scope.service';

@Module({
  controllers: [ScopeController],
  providers: [
    ScopeService,
    {
      provide: IScopeUsecase,
      useClass: ScopeService,
    },
    ScopeRepository,
  ],
})
export class ScopeModule {}
