import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
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

export const GET_BOOK_BY_ID = gql`
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

export const GET_AUTHORS = gql`
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

export const GET_CATEGORIES = gql`
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

export const SEARCH_GOOGLE_BOOKS = gql`
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