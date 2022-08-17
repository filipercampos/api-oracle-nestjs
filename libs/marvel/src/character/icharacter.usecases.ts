import { Character } from './models/character.model';

export abstract class ICharacterUsecase {
  /**
   * Get character by id
   */
  abstract getCharacterById(id: string): Promise<Character>;

  /**
   * Get characters
   */
  abstract getCharacters(name: string): Promise<Character[]>;
}
