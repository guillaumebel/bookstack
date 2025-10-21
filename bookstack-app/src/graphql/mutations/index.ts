import { gql } from '@apollo/client';

export const ADD_BOOK = gql`
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

export const UPDATE_BOOK = gql`
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

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id)
  }
`;

export const ADD_AUTHOR = gql`
  mutation AddAuthor($name: String!) {
    addAuthor(name: $name) {
      id
      name
      createdAt
    }
  }
`;

export const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!) {
    addCategory(name: $name) {
      id
      name
      createdAt
    }
  }
`;

export const IMPORT_BOOK_FROM_GOOGLE = gql`
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