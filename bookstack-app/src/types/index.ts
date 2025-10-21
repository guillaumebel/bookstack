export interface Book {
  id: number;
  title: string;
  isbn?: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  thumbnail?: string;
  language?: string;
  googleBooksId?: string;
  createdAt: string;
  updatedAt: string;
  bookAuthors: BookAuthor[];
  bookCategories: BookCategory[];
}

export interface Author {
  id: number;
  name: string;
  createdAt: string;
  bookAuthors: BookAuthor[];
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  bookCategories: BookCategory[];
}

export interface BookAuthor {
  bookId: number;
  authorId: number;
  book: Book;
  author: Author;
}

export interface BookCategory {
  bookId: number;
  categoryId: number;
  book: Book;
  category: Category;
}

export interface AddBookInput {
  title: string;
  isbn?: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  thumbnail?: string;
  language?: string;
  googleBooksId?: string;
  authorIds?: number[];
  categoryIds?: number[];
}

export interface UpdateBookInput {
  title?: string;
  isbn?: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  thumbnail?: string;
  language?: string;
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    language?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
  };
}

export interface GoogleBooksResponse {
  totalItems: number;
  items: GoogleBookItem[];
}