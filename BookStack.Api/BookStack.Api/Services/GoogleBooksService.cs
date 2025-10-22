using BookStack.Api.Models.GoogleBooks;

namespace BookStack.Api.Services;

public class GoogleBooksService(HttpClient httpClient)
{
  private const string BaseUrl = "https://www.googleapis.com/books/v1/volumes";

  public async Task<GoogleBooksResponse?> SearchBooksAsync(string query, int maxResults = 10)
  {
    var response = await httpClient.GetAsync($"{BaseUrl}?q={Uri.EscapeDataString(query)}&maxResults={maxResults}");
    response.EnsureSuccessStatusCode();
    return await response.Content.ReadFromJsonAsync<GoogleBooksResponse>();
  }

  public async Task<GoogleBookItem?> GetBookByIdAsync(string id)
  {
    var response = await httpClient.GetAsync($"{BaseUrl}/{id}");
    response.EnsureSuccessStatusCode();
    return await response.Content.ReadFromJsonAsync<GoogleBookItem>();
  }

  public async Task<GoogleBooksResponse?> SearchByIsbnAsync(string isbn)
  {
    var response = await httpClient.GetAsync($"{BaseUrl}?q=isbn:{isbn}");
    response.EnsureSuccessStatusCode();
    return await response.Content.ReadFromJsonAsync<GoogleBooksResponse>();
  }
}
