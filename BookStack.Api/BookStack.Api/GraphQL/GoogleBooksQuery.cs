using BookStack.Api.Services;
using HotChocolate.Types;

namespace BookStack.Api.GraphQL;

[ExtendObjectType<Query>]
public class GoogleBooksQuery
{
  public async Task<GoogleBooksResponse?> SearchGoogleBooks(string query, int maxResults, [Service] GoogleBooksService service)
      => await service.SearchBooksAsync(query, maxResults);

  public async Task<GoogleBookItem?> GetGoogleBookById(string id, [Service] GoogleBooksService service)
      => await service.GetBookByIdAsync(id);

  public async Task<GoogleBooksResponse?> SearchGoogleBooksByIsbn(string isbn, [Service] GoogleBooksService service)
      => await service.SearchByIsbnAsync(isbn);
}
