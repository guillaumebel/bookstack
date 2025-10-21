namespace BookStack.Api.Services;

public class GoogleBooksService
{
    private readonly HttpClient _httpClient;
    private const string BaseUrl = "https://www.googleapis.com/books/v1/volumes";

    public GoogleBooksService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<GoogleBooksResponse?> SearchBooksAsync(string query, int maxResults = 10)
    {
        var response = await _httpClient.GetAsync($"{BaseUrl}?q={Uri.EscapeDataString(query)}&maxResults={maxResults}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<GoogleBooksResponse>();
    }

    public async Task<GoogleBookItem?> GetBookByIdAsync(string id)
    {
        var response = await _httpClient.GetAsync($"{BaseUrl}/{id}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<GoogleBookItem>();
    }

    public async Task<GoogleBooksResponse?> SearchByIsbnAsync(string isbn)
    {
        var response = await _httpClient.GetAsync($"{BaseUrl}?q=isbn:{isbn}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<GoogleBooksResponse>();
    }
}

public class GoogleBooksResponse
{
    public string Kind { get; set; } = string.Empty;
    public int TotalItems { get; set; }
    public List<GoogleBookItem> Items { get; set; } = new();
}

public class GoogleBookItem
{
    public string Kind { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
    public string Etag { get; set; } = string.Empty;
    public string SelfLink { get; set; } = string.Empty;
    public VolumeInfo VolumeInfo { get; set; } = new();
}

public class VolumeInfo
{
    public string Title { get; set; } = string.Empty;
    public List<string> Authors { get; set; } = new();
    public string? Publisher { get; set; }
    public string? PublishedDate { get; set; }
    public string? Description { get; set; }
    public List<IndustryIdentifier> IndustryIdentifiers { get; set; } = new();
    public int? PageCount { get; set; }
    public List<string> Categories { get; set; } = new();
    public ImageLinks? ImageLinks { get; set; }
    public string? Language { get; set; }
}

public class IndustryIdentifier
{
    public string Type { get; set; } = string.Empty;
    public string Identifier { get; set; } = string.Empty;
}

public class ImageLinks
{
    public string? SmallThumbnail { get; set; }
    public string? Thumbnail { get; set; }
}
