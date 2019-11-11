import { books } from './books.entity';

export const booksProviders = [
  {
    provide: 'BOOKS_REPOSITORY',
    useValue: books,
  },
];