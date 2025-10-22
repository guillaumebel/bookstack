namespace BookStack.Api.Models.GoogleBooks;

public class GoogleBookItem
{
  public string Kind { get; set; } = string.Empty;
  public string Id { get; set; } = string.Empty;
  public string Etag { get; set; } = string.Empty;
  public string SelfLink { get; set; } = string.Empty;
  public VolumeInfo VolumeInfo { get; set; } = new();
}
