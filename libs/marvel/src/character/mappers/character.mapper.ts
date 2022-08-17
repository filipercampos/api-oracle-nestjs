import { BaseMapper } from '@common/data/base/base.mapper';
import { Character } from '../models/character.model';
/**
 * Response /character marvel service
 */
export class CharacterMapper extends BaseMapper<Character> {
  fromJson(data: any): Character {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
    };
  }
}
