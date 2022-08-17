import { Comic } from './models/comic.model';

export abstract class IComicUsecase {
  /**
   * Get comic book by id
   */
  abstract getComicById(id: string): Promise<Comic>;
  /**
   * Get comics books
   */
  abstract getComics(title: string): Promise<Comic[]>;
}
