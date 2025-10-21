using BookStack.Api.Data;
using BookStack.Api.Models;
using HotChocolate.Types;

namespace BookStack.Api.GraphQL;

public class Query
{
  [UseProjection]
  [UseFiltering]
  [UseSorting]
  public IQueryable<Book> GetBooks([Service] BookStackContext context)
      => context.Books;

  public async Task<Book?> GetBookById(int id, [Service] BookStackContext context)
      => await context.Books.FindAsync(id);

  [UseProjection]
  [UseFiltering]
  [UseSorting]
  public IQueryable<Author> GetAuthors([Service] BookStackContext context)
      => context.Authors;

  [UseProjection]
  [UseFiltering]
  [UseSorting]
  public IQueryable<Category> GetCategories([Service] BookStackContext context)
      => context.Categories;
}
