import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AddBookInput = {
  authorIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  categoryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  googleBooksId?: InputMaybe<Scalars['String']['input']>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  pageCount?: InputMaybe<Scalars['Int']['input']>;
  publishedDate?: InputMaybe<Scalars['DateTime']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type Author = {
  __typename?: 'Author';
  bookAuthors: Array<BookAuthor>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type AuthorFilterInput = {
  and?: InputMaybe<Array<AuthorFilterInput>>;
  bookAuthors?: InputMaybe<ListFilterInputTypeOfBookAuthorFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AuthorFilterInput>>;
};

export type AuthorSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type Book = {
  __typename?: 'Book';
  bookAuthors: Array<BookAuthor>;
  bookCategories: Array<BookCategory>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  googleBooksId?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isbn?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  pageCount?: Maybe<Scalars['Int']['output']>;
  publishedDate?: Maybe<Scalars['DateTime']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BookAuthor = {
  __typename?: 'BookAuthor';
  author: Author;
  authorId: Scalars['Int']['output'];
  book: Book;
  bookId: Scalars['Int']['output'];
};

export type BookAuthorFilterInput = {
  and?: InputMaybe<Array<BookAuthorFilterInput>>;
  author?: InputMaybe<AuthorFilterInput>;
  authorId?: InputMaybe<IntOperationFilterInput>;
  book?: InputMaybe<BookFilterInput>;
  bookId?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<BookAuthorFilterInput>>;
};

export type BookCategory = {
  __typename?: 'BookCategory';
  book: Book;
  bookId: Scalars['Int']['output'];
  category: Category;
  categoryId: Scalars['Int']['output'];
};

export type BookCategoryFilterInput = {
  and?: InputMaybe<Array<BookCategoryFilterInput>>;
  book?: InputMaybe<BookFilterInput>;
  bookId?: InputMaybe<IntOperationFilterInput>;
  category?: InputMaybe<CategoryFilterInput>;
  categoryId?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<BookCategoryFilterInput>>;
};

export type BookFilterInput = {
  and?: InputMaybe<Array<BookFilterInput>>;
  bookAuthors?: InputMaybe<ListFilterInputTypeOfBookAuthorFilterInput>;
  bookCategories?: InputMaybe<ListFilterInputTypeOfBookCategoryFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  googleBooksId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isbn?: InputMaybe<StringOperationFilterInput>;
  language?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BookFilterInput>>;
  pageCount?: InputMaybe<IntOperationFilterInput>;
  publishedDate?: InputMaybe<DateTimeOperationFilterInput>;
  thumbnail?: InputMaybe<StringOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type BookSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  googleBooksId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isbn?: InputMaybe<SortEnumType>;
  language?: InputMaybe<SortEnumType>;
  pageCount?: InputMaybe<SortEnumType>;
  publishedDate?: InputMaybe<SortEnumType>;
  thumbnail?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export type Category = {
  __typename?: 'Category';
  bookCategories: Array<BookCategory>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CategoryFilterInput = {
  and?: InputMaybe<Array<CategoryFilterInput>>;
  bookCategories?: InputMaybe<ListFilterInputTypeOfBookCategoryFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CategoryFilterInput>>;
};

export type CategorySortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type GoogleBookItem = {
  __typename?: 'GoogleBookItem';
  etag: Scalars['String']['output'];
  id: Scalars['String']['output'];
  kind: Scalars['String']['output'];
  selfLink: Scalars['String']['output'];
  volumeInfo: VolumeInfo;
};

export type GoogleBooksResponse = {
  __typename?: 'GoogleBooksResponse';
  items: Array<GoogleBookItem>;
  kind: Scalars['String']['output'];
  totalItems: Scalars['Int']['output'];
};

export type ImageLinks = {
  __typename?: 'ImageLinks';
  smallThumbnail?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type IndustryIdentifier = {
  __typename?: 'IndustryIdentifier';
  identifier: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type ListFilterInputTypeOfBookAuthorFilterInput = {
  all?: InputMaybe<BookAuthorFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BookAuthorFilterInput>;
  some?: InputMaybe<BookAuthorFilterInput>;
};

export type ListFilterInputTypeOfBookCategoryFilterInput = {
  all?: InputMaybe<BookCategoryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<BookCategoryFilterInput>;
  some?: InputMaybe<BookCategoryFilterInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAuthor: Author;
  addBook: Book;
  addCategory: Category;
  deleteBook: Scalars['Boolean']['output'];
  importBookFromGoogle: Book;
  updateBook: Book;
};


export type MutationAddAuthorArgs = {
  name: Scalars['String']['input'];
};


export type MutationAddBookArgs = {
  input: AddBookInput;
};


export type MutationAddCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteBookArgs = {
  id: Scalars['Int']['input'];
};


export type MutationImportBookFromGoogleArgs = {
  googleBooksId: Scalars['String']['input'];
};


export type MutationUpdateBookArgs = {
  id: Scalars['Int']['input'];
  input: UpdateBookInput;
};

export type Query = {
  __typename?: 'Query';
  authors: Array<Author>;
  bookById?: Maybe<Book>;
  books: Array<Book>;
  categories: Array<Category>;
  googleBookById?: Maybe<GoogleBookItem>;
  searchGoogleBooks?: Maybe<GoogleBooksResponse>;
  searchGoogleBooksByIsbn?: Maybe<GoogleBooksResponse>;
};


export type QueryAuthorsArgs = {
  order?: InputMaybe<Array<AuthorSortInput>>;
  where?: InputMaybe<AuthorFilterInput>;
};


export type QueryBookByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryBooksArgs = {
  order?: InputMaybe<Array<BookSortInput>>;
  where?: InputMaybe<BookFilterInput>;
};


export type QueryCategoriesArgs = {
  order?: InputMaybe<Array<CategorySortInput>>;
  where?: InputMaybe<CategoryFilterInput>;
};


export type QueryGoogleBookByIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerySearchGoogleBooksArgs = {
  maxResults: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};


export type QuerySearchGoogleBooksByIsbnArgs = {
  isbn: Scalars['String']['input'];
};

export const SortEnumType = {
  Asc: 'ASC',
  Desc: 'DESC'
} as const;

export type SortEnumType = typeof SortEnumType[keyof typeof SortEnumType];
export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBookInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  pageCount?: InputMaybe<Scalars['Int']['input']>;
  publishedDate?: InputMaybe<Scalars['DateTime']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type VolumeInfo = {
  __typename?: 'VolumeInfo';
  authors: Array<Scalars['String']['output']>;
  categories: Array<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  imageLinks?: Maybe<ImageLinks>;
  industryIdentifiers: Array<IndustryIdentifier>;
  language?: Maybe<Scalars['String']['output']>;
  pageCount?: Maybe<Scalars['Int']['output']>;
  publishedDate?: Maybe<Scalars['String']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type AddBookMutationVariables = Exact<{
  input: AddBookInput;
}>;


export type AddBookMutation = { __typename?: 'Mutation', addBook: { __typename?: 'Book', id: number, title: string, isbn?: string | null, description?: string | null, publishedDate?: any | null, pageCount?: number | null, thumbnail?: string | null, language?: string | null, googleBooksId?: string | null, createdAt: any, updatedAt: any, bookAuthors: Array<{ __typename?: 'BookAuthor', author: { __typename?: 'Author', id: number, name: string } }>, bookCategories: Array<{ __typename?: 'BookCategory', category: { __typename?: 'Category', id: number, name: string } }> } };

export type UpdateBookMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateBookInput;
}>;


export type UpdateBookMutation = { __typename?: 'Mutation', updateBook: { __typename?: 'Book', id: number, title: string, isbn?: string | null, description?: string | null, publishedDate?: any | null, pageCount?: number | null, thumbnail?: string | null, language?: string | null, googleBooksId?: string | null, updatedAt: any, bookAuthors: Array<{ __typename?: 'BookAuthor', author: { __typename?: 'Author', id: number, name: string } }>, bookCategories: Array<{ __typename?: 'BookCategory', category: { __typename?: 'Category', id: number, name: string } }> } };

export type DeleteBookMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteBookMutation = { __typename?: 'Mutation', deleteBook: boolean };

export type AddAuthorMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type AddAuthorMutation = { __typename?: 'Mutation', addAuthor: { __typename?: 'Author', id: number, name: string, createdAt: any } };

export type AddCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type AddCategoryMutation = { __typename?: 'Mutation', addCategory: { __typename?: 'Category', id: number, name: string, createdAt: any } };

export type ImportBookFromGoogleMutationVariables = Exact<{
  googleBooksId: Scalars['String']['input'];
}>;


export type ImportBookFromGoogleMutation = { __typename?: 'Mutation', importBookFromGoogle: { __typename?: 'Book', id: number, title: string, isbn?: string | null, description?: string | null, publishedDate?: any | null, pageCount?: number | null, thumbnail?: string | null, language?: string | null, googleBooksId?: string | null, createdAt: any, updatedAt: any, bookAuthors: Array<{ __typename?: 'BookAuthor', author: { __typename?: 'Author', id: number, name: string } }>, bookCategories: Array<{ __typename?: 'BookCategory', category: { __typename?: 'Category', id: number, name: string } }> } };

export type GetBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBooksQuery = { __typename?: 'Query', books: Array<{ __typename?: 'Book', id: number, title: string, isbn?: string | null, description?: string | null, publishedDate?: any | null, pageCount?: number | null, thumbnail?: string | null, language?: string | null, googleBooksId?: string | null, createdAt: any, updatedAt: any, bookAuthors: Array<{ __typename?: 'BookAuthor', author: { __typename?: 'Author', id: number, name: string } }>, bookCategories: Array<{ __typename?: 'BookCategory', category: { __typename?: 'Category', id: number, name: string } }> }> };

export type GetBookByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetBookByIdQuery = { __typename?: 'Query', bookById?: { __typename?: 'Book', id: number, title: string, isbn?: string | null, description?: string | null, publishedDate?: any | null, pageCount?: number | null, thumbnail?: string | null, language?: string | null, googleBooksId?: string | null, createdAt: any, updatedAt: any, bookAuthors: Array<{ __typename?: 'BookAuthor', author: { __typename?: 'Author', id: number, name: string } }>, bookCategories: Array<{ __typename?: 'BookCategory', category: { __typename?: 'Category', id: number, name: string } }> } | null };

export type GetAuthorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthorsQuery = { __typename?: 'Query', authors: Array<{ __typename?: 'Author', id: number, name: string, createdAt: any, bookAuthors: Array<{ __typename?: 'BookAuthor', bookId: number }> }> };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, name: string, createdAt: any, bookCategories: Array<{ __typename?: 'BookCategory', bookId: number }> }> };

export type SearchGoogleBooksQueryVariables = Exact<{
  query: Scalars['String']['input'];
  maxResults: Scalars['Int']['input'];
}>;


export type SearchGoogleBooksQuery = { __typename?: 'Query', searchGoogleBooks?: { __typename?: 'GoogleBooksResponse', totalItems: number, items: Array<{ __typename?: 'GoogleBookItem', id: string, volumeInfo: { __typename?: 'VolumeInfo', title: string, authors: Array<string>, description?: string | null, publishedDate?: string | null, pageCount?: number | null, categories: Array<string>, language?: string | null, imageLinks?: { __typename?: 'ImageLinks', thumbnail?: string | null } | null, industryIdentifiers: Array<{ __typename?: 'IndustryIdentifier', type: string, identifier: string }> } }> } | null };


export const AddBookDocument = gql`
    mutation AddBook($input: AddBookInput!) {
  addBook(input: $input) {
    id
    title
    isbn
    description
    publishedDate
    pageCount
    thumbnail
    language
    googleBooksId
    createdAt
    updatedAt
    bookAuthors {
      author {
        id
        name
      }
    }
    bookCategories {
      category {
        id
        name
      }
    }
  }
}
    `;
export type AddBookMutationFn = Apollo.MutationFunction<AddBookMutation, AddBookMutationVariables>;
export function useAddBookMutation(baseOptions?: Apollo.MutationHookOptions<AddBookMutation, AddBookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBookMutation, AddBookMutationVariables>(AddBookDocument, options);
      }
export type AddBookMutationHookResult = ReturnType<typeof useAddBookMutation>;
export type AddBookMutationResult = Apollo.MutationResult<AddBookMutation>;
export type AddBookMutationOptions = Apollo.BaseMutationOptions<AddBookMutation, AddBookMutationVariables>;
export const UpdateBookDocument = gql`
    mutation UpdateBook($id: Int!, $input: UpdateBookInput!) {
  updateBook(id: $id, input: $input) {
    id
    title
    isbn
    description
    publishedDate
    pageCount
    thumbnail
    language
    googleBooksId
    updatedAt
    bookAuthors {
      author {
        id
        name
      }
    }
    bookCategories {
      category {
        id
        name
      }
    }
  }
}
    `;
export type UpdateBookMutationFn = Apollo.MutationFunction<UpdateBookMutation, UpdateBookMutationVariables>;
export function useUpdateBookMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBookMutation, UpdateBookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBookMutation, UpdateBookMutationVariables>(UpdateBookDocument, options);
      }
export type UpdateBookMutationHookResult = ReturnType<typeof useUpdateBookMutation>;
export type UpdateBookMutationResult = Apollo.MutationResult<UpdateBookMutation>;
export type UpdateBookMutationOptions = Apollo.BaseMutationOptions<UpdateBookMutation, UpdateBookMutationVariables>;
export const DeleteBookDocument = gql`
    mutation DeleteBook($id: Int!) {
  deleteBook(id: $id)
}
    `;
export type DeleteBookMutationFn = Apollo.MutationFunction<DeleteBookMutation, DeleteBookMutationVariables>;
export function useDeleteBookMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBookMutation, DeleteBookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBookMutation, DeleteBookMutationVariables>(DeleteBookDocument, options);
      }
export type DeleteBookMutationHookResult = ReturnType<typeof useDeleteBookMutation>;
export type DeleteBookMutationResult = Apollo.MutationResult<DeleteBookMutation>;
export type DeleteBookMutationOptions = Apollo.BaseMutationOptions<DeleteBookMutation, DeleteBookMutationVariables>;
export const AddAuthorDocument = gql`
    mutation AddAuthor($name: String!) {
  addAuthor(name: $name) {
    id
    name
    createdAt
  }
}
    `;
export type AddAuthorMutationFn = Apollo.MutationFunction<AddAuthorMutation, AddAuthorMutationVariables>;
export function useAddAuthorMutation(baseOptions?: Apollo.MutationHookOptions<AddAuthorMutation, AddAuthorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAuthorMutation, AddAuthorMutationVariables>(AddAuthorDocument, options);
      }
export type AddAuthorMutationHookResult = ReturnType<typeof useAddAuthorMutation>;
export type AddAuthorMutationResult = Apollo.MutationResult<AddAuthorMutation>;
export type AddAuthorMutationOptions = Apollo.BaseMutationOptions<AddAuthorMutation, AddAuthorMutationVariables>;
export const AddCategoryDocument = gql`
    mutation AddCategory($name: String!) {
  addCategory(name: $name) {
    id
    name
    createdAt
  }
}
    `;
export type AddCategoryMutationFn = Apollo.MutationFunction<AddCategoryMutation, AddCategoryMutationVariables>;
export function useAddCategoryMutation(baseOptions?: Apollo.MutationHookOptions<AddCategoryMutation, AddCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCategoryMutation, AddCategoryMutationVariables>(AddCategoryDocument, options);
      }
export type AddCategoryMutationHookResult = ReturnType<typeof useAddCategoryMutation>;
export type AddCategoryMutationResult = Apollo.MutationResult<AddCategoryMutation>;
export type AddCategoryMutationOptions = Apollo.BaseMutationOptions<AddCategoryMutation, AddCategoryMutationVariables>;
export const ImportBookFromGoogleDocument = gql`
    mutation ImportBookFromGoogle($googleBooksId: String!) {
  importBookFromGoogle(googleBooksId: $googleBooksId) {
    id
    title
    isbn
    description
    publishedDate
    pageCount
    thumbnail
    language
    googleBooksId
    createdAt
    updatedAt
    bookAuthors {
      author {
        id
        name
      }
    }
    bookCategories {
      category {
        id
        name
      }
    }
  }
}
    `;
export type ImportBookFromGoogleMutationFn = Apollo.MutationFunction<ImportBookFromGoogleMutation, ImportBookFromGoogleMutationVariables>;
export function useImportBookFromGoogleMutation(baseOptions?: Apollo.MutationHookOptions<ImportBookFromGoogleMutation, ImportBookFromGoogleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ImportBookFromGoogleMutation, ImportBookFromGoogleMutationVariables>(ImportBookFromGoogleDocument, options);
      }
export type ImportBookFromGoogleMutationHookResult = ReturnType<typeof useImportBookFromGoogleMutation>;
export type ImportBookFromGoogleMutationResult = Apollo.MutationResult<ImportBookFromGoogleMutation>;
export type ImportBookFromGoogleMutationOptions = Apollo.BaseMutationOptions<ImportBookFromGoogleMutation, ImportBookFromGoogleMutationVariables>;
export const GetBooksDocument = gql`
    query GetBooks {
  books {
    id
    title
    isbn
    description
    publishedDate
    pageCount
    thumbnail
    language
    googleBooksId
    createdAt
    updatedAt
    bookAuthors {
      author {
        id
        name
      }
    }
    bookCategories {
      category {
        id
        name
      }
    }
  }
}
    `;
export function useGetBooksQuery(baseOptions?: Apollo.QueryHookOptions<GetBooksQuery, GetBooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBooksQuery, GetBooksQueryVariables>(GetBooksDocument, options);
      }
export function useGetBooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBooksQuery, GetBooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBooksQuery, GetBooksQueryVariables>(GetBooksDocument, options);
        }
export type GetBooksQueryHookResult = ReturnType<typeof useGetBooksQuery>;
export type GetBooksLazyQueryHookResult = ReturnType<typeof useGetBooksLazyQuery>;
export type GetBooksQueryResult = Apollo.QueryResult<GetBooksQuery, GetBooksQueryVariables>;
export const GetBookByIdDocument = gql`
    query GetBookById($id: Int!) {
  bookById(id: $id) {
    id
    title
    isbn
    description
    publishedDate
    pageCount
    thumbnail
    language
    googleBooksId
    createdAt
    updatedAt
    bookAuthors {
      author {
        id
        name
      }
    }
    bookCategories {
      category {
        id
        name
      }
    }
  }
}
    `;
export function useGetBookByIdQuery(baseOptions: Apollo.QueryHookOptions<GetBookByIdQuery, GetBookByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookByIdQuery, GetBookByIdQueryVariables>(GetBookByIdDocument, options);
      }
export function useGetBookByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookByIdQuery, GetBookByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookByIdQuery, GetBookByIdQueryVariables>(GetBookByIdDocument, options);
        }
export type GetBookByIdQueryHookResult = ReturnType<typeof useGetBookByIdQuery>;
export type GetBookByIdLazyQueryHookResult = ReturnType<typeof useGetBookByIdLazyQuery>;
export type GetBookByIdQueryResult = Apollo.QueryResult<GetBookByIdQuery, GetBookByIdQueryVariables>;
export const GetAuthorsDocument = gql`
    query GetAuthors {
  authors {
    id
    name
    createdAt
    bookAuthors {
      bookId
    }
  }
}
    `;
export function useGetAuthorsQuery(baseOptions?: Apollo.QueryHookOptions<GetAuthorsQuery, GetAuthorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuthorsQuery, GetAuthorsQueryVariables>(GetAuthorsDocument, options);
      }
export function useGetAuthorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuthorsQuery, GetAuthorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuthorsQuery, GetAuthorsQueryVariables>(GetAuthorsDocument, options);
        }
export type GetAuthorsQueryHookResult = ReturnType<typeof useGetAuthorsQuery>;
export type GetAuthorsLazyQueryHookResult = ReturnType<typeof useGetAuthorsLazyQuery>;
export type GetAuthorsQueryResult = Apollo.QueryResult<GetAuthorsQuery, GetAuthorsQueryVariables>;
export const GetCategoriesDocument = gql`
    query GetCategories {
  categories {
    id
    name
    createdAt
    bookCategories {
      bookId
    }
  }
}
    `;
export function useGetCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
      }
export function useGetCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesQueryResult = Apollo.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const SearchGoogleBooksDocument = gql`
    query SearchGoogleBooks($query: String!, $maxResults: Int!) {
  searchGoogleBooks(query: $query, maxResults: $maxResults) {
    totalItems
    items {
      id
      volumeInfo {
        title
        authors
        description
        publishedDate
        pageCount
        categories
        language
        imageLinks {
          thumbnail
        }
        industryIdentifiers {
          type
          identifier
        }
      }
    }
  }
}
    `;
export function useSearchGoogleBooksQuery(baseOptions: Apollo.QueryHookOptions<SearchGoogleBooksQuery, SearchGoogleBooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchGoogleBooksQuery, SearchGoogleBooksQueryVariables>(SearchGoogleBooksDocument, options);
      }
export function useSearchGoogleBooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchGoogleBooksQuery, SearchGoogleBooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchGoogleBooksQuery, SearchGoogleBooksQueryVariables>(SearchGoogleBooksDocument, options);
        }
export type SearchGoogleBooksQueryHookResult = ReturnType<typeof useSearchGoogleBooksQuery>;
export type SearchGoogleBooksLazyQueryHookResult = ReturnType<typeof useSearchGoogleBooksLazyQuery>;
export type SearchGoogleBooksQueryResult = Apollo.QueryResult<SearchGoogleBooksQuery, SearchGoogleBooksQueryVariables>;