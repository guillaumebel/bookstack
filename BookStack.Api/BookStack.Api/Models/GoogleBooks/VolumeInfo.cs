namespace BookStack.Api.Models.GoogleBooks;

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
