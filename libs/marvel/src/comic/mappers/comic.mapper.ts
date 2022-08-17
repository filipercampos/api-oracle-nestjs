import { BaseMapper } from '@common/data/base/base.mapper';
import { Comic } from '../models/comic.model';
/**
 * Response /comics marvel service
 */
export class ComicMapper extends BaseMapper<Comic> {
  fromJson(data: any): Comic {
    if (!data) return null;
    return {
      id: data.id,
      title: data.title,
      digitalId: data.digitalId,
    };
  }
}
