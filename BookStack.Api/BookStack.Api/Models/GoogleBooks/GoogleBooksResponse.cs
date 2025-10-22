
namespace BookStack.Api.Models.GoogleBooks;

public class GoogleBooksResponse
{
  public string Kind { get; set; } = string.Empty;
  public int TotalItems { get; set; }
  public List<GoogleBookItem> Items { get; set; } = new();
}

