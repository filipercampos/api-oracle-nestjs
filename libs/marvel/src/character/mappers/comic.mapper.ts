import { Comic } from '@app/marvel/comic/models/comic.model';
import { BaseMapper } from '@common/data/base/base.mapper';
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
