import { Test, TestingModule } from '@nestjs/testing';
import { ScopeController } from './scope.controller';

describe('ScopeController', () => {
  let controller: ScopeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScopeController],
    }).compile();

    controller = module.get<ScopeController>(ScopeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
