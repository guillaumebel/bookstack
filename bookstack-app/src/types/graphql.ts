// GraphQL Response Types
export interface Author {
  id: number;
  name: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface BookAuthor {
  author: Author;
}

export interface BookCategory {
  category: Category;
}

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

// Query Response Types
export interface GetBooksQueryResponse {
  books: Book[];
}

export interface GetAuthorsQueryResponse {
  authors: Author[];
}

export interface GetCategoriesQueryResponse {
  categories: Category[];
}

export interface GetBookByIdQueryResponse {
  bookById: Book;
}

// Google Books Types
export interface GoogleBookVolumeInfo {
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
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

export interface GoogleBooksResponse {
  totalItems: number;
  items: GoogleBookItem[];
}

export interface SearchGoogleBooksQueryResponse {
  searchGoogleBooks: GoogleBooksResponse;
}