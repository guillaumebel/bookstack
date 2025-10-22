using System.Net;
using System.Text.Json;
using BookStack.Api.Models.GoogleBooks;
using BookStack.Api.Services;
using Moq;
using Moq.Protected;

namespace BookStack.Api.Tests.Services;

public class GoogleBooksServiceTests
{
  private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
  private readonly HttpClient _httpClient;
  private readonly GoogleBooksService _googleBooksService;

  public GoogleBooksServiceTests()
  {
    _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
    _httpClient = new HttpClient(_mockHttpMessageHandler.Object);
    _googleBooksService = new GoogleBooksService(_httpClient);
  }

  [Fact]
  public async Task SearchBooksAsync_WithValidQuery_ShouldReturnResults()
  {
    // Arrange
    var expectedResponse = new GoogleBooksResponse
    {
      TotalItems = 1,
      Items = new[]
        {
                new GoogleBookItem
                {
                    Id = "test123",
                    VolumeInfo = new VolumeInfo
                    {
                        Title = "Test Book",
                        Authors = new[] { "Test Author" }.ToList()
                    }
                }
            }.ToList()
    };

    var jsonResponse = JsonSerializer.Serialize(expectedResponse);
    var httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
    {
      Content = new StringContent(jsonResponse, System.Text.Encoding.UTF8, "application/json")
    };

    _mockHttpMessageHandler.Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.IsAny<HttpRequestMessage>(),
            ItExpr.IsAny<CancellationToken>())
        .ReturnsAsync(httpResponse);

    // Act
    var result = await _googleBooksService.SearchBooksAsync("Clean Code", 5);

    // Assert
    Assert.NotNull(result);
    Assert.Equal(1, result.TotalItems);
    Assert.Single(result.Items);
    Assert.Equal("test123", result.Items.First().Id);
    Assert.Equal("Test Book", result.Items.First().VolumeInfo.Title);
  }

  [Fact]
  public async Task GetBookByIdAsync_WithValidId_ShouldReturnBook()
  {
    // Arrange
    var expectedBook = new GoogleBookItem
    {
      Id = "test123",
      VolumeInfo = new VolumeInfo
      {
        Title = "Test Book",
        Description = "Test Description",
        Authors = new[] { "Test Author" }.ToList(),
        Categories = new[] { "Fiction" }.ToList(),
        PublishedDate = "2023-01-01",
        PageCount = 200,
        Language = "en"
      }
    };

    var jsonResponse = JsonSerializer.Serialize(expectedBook);
    var httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
    {
      Content = new StringContent(jsonResponse, System.Text.Encoding.UTF8, "application/json")
    };

    _mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(req =>
                req.Method == HttpMethod.Get &&
                req.RequestUri!.ToString().Contains("test123")),
            ItExpr.IsAny<CancellationToken>())
        .ReturnsAsync(httpResponse);

    // Act
    var result = await _googleBooksService.GetBookByIdAsync("test123");

    // Assert
    Assert.NotNull(result);
    Assert.Equal("test123", result.Id);
    Assert.Equal("Test Book", result.VolumeInfo.Title);
    Assert.Equal("Test Description", result.VolumeInfo.Description);
    Assert.Single(result.VolumeInfo.Authors);
    Assert.Equal("Test Author", result.VolumeInfo.Authors.First());
    Assert.Single(result.VolumeInfo.Categories);
    Assert.Equal("Fiction", result.VolumeInfo.Categories.First());
    Assert.Equal("2023-01-01", result.VolumeInfo.PublishedDate);
    Assert.Equal(200, result.VolumeInfo.PageCount);
    Assert.Equal("en", result.VolumeInfo.Language);
  }

  [Fact]
  public async Task SearchBooksAsync_WithHttpError_ShouldThrowException()
  {
    // Arrange
    var httpResponse = new HttpResponseMessage(HttpStatusCode.InternalServerError);

    _mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.IsAny<HttpRequestMessage>(),
            ItExpr.IsAny<CancellationToken>())
        .ReturnsAsync(httpResponse);

    // Act & Assert
    await Assert.ThrowsAsync<HttpRequestException>(() =>
        _googleBooksService.SearchBooksAsync("Test Query"));
  }
}