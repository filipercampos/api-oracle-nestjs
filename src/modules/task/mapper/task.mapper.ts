import { BaseMapper } from '@common/data/base/base.mapper';
import { PostTaskDto } from '../dto/post-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskMetadataType } from '../repositories/task.metadata';

export class TaskMapper extends BaseMapper<TaskEntity> {
  fromJson(data: any): TaskEntity {
    if (!data) return null;
    return {
      id: data.TSK_ID.toString('hex')?.toUpperCase(),
      name: data.TSK_NAM,
      description: data.TSK_DSC,
      userId: data.TSK_USU_ID,
      done: Boolean(data.TSK_STS),
    } as TaskEntity;
  }

  override toPost(data: PostTaskDto): TaskMetadataType {
    //columns name table
    const metadata = {
      TSK_NAM: data.name,
      TSK_DSC: data.description,
      TSK_USU_ID: data.userId,
      TSK_STS: data.done === true ? 1 : 0,
    } as TaskMetadataType;
    return metadata;
  }

  override toUpdate(data: PostTaskDto): TaskMetadataType {
    //columns name table
    const metadata = {
      TSK_NAM: data.name,
      TSK_DSC: data.description,
      TSK_USU_ID: data.userId,
      TSK_STS: data.done === true ? 1 : 0,
    } as TaskMetadataType;
    return metadata;
  }
}
