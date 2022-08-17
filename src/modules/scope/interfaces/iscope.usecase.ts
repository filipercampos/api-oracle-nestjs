import { Injectable } from '@nestjs/common';
import { MessageDto } from '@shared/dto';
import { GetScopeDto } from '../dto/get-scope.dto';
import { PostScopeDto } from '../dto/post-scope.dto';
import { ScopeEntity } from '../entities/scope.entity';

@Injectable()
export abstract class IScopeUsecase {
  /**
   * Get scope by id
   */
  abstract getScopeById(id: string): Promise<ScopeEntity>;

  /**
   * Get scopes
   */
  abstract getScopes(query: GetScopeDto): Promise<ScopeEntity[]>;

  /**
   * Save scope
   */
  abstract postScope(body: PostScopeDto): Promise<MessageDto>;

  /**
   * Delete scope
   */
  abstract deleteScope(id: string): Promise<MessageDto>;
}
