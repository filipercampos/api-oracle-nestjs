import { BaseMapper } from '@common/data/base/base.mapper';
import { PostScopeDto } from '../dto/post-scope.dto';
import { ScopeEntity } from '../entities/scope.entity';
import { ScopeMetadataType } from '../repositories/scope.metadata';

export class ScopeMapper extends BaseMapper<ScopeEntity> {
  fromJson(data: any): ScopeEntity {
    if (!data) return null;
    return {
      id: data.SCP_ID.toString('hex')?.toUpperCase(),
      scope: data.SCP_NAME,
      description: data.SCP_DSC,
    } as ScopeEntity;
  }

  override toPost(data: PostScopeDto) {
    //columns name table
    const metadata = {
      SCP_NAM: data.name,
      SCP_DSC: data.description,
    } as ScopeMetadataType;
    return metadata;
  }
}
