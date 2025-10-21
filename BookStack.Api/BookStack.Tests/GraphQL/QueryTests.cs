using BookStack.Api.GraphQL;
using BookStack.Api.Models;

namespace BookStack.Api.Tests.GraphQL;

public class QueryTests : DatabaseTestBase
{
  private readonly Query _query;

  public QueryTests()
  {
    _query = new Query();
  }

  [Fact]
  public void GetBooks_WithEmptyDatabase_ShouldReturnEmptyQueryable()
  {
    // Act
    var result = _query.GetBooks(Context);

    // Assert
    Assert.NotNull(result);
    Assert.Empty(result.ToList());
  }

  [Fact]
  public void GetBooks_WithBooksInDatabase_ShouldReturnAllBooks()
  {
    // Arrange
    var book1 = new Book { Title = "Book 1", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
    var book2 = new Book { Title = "Book 2", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };

    Context.Books.AddRange(book1, book2);
    Context.SaveChanges();

    // Act
    var result = _query.GetBooks(Context).ToList();

    // Assert
    Assert.NotNull(result);
    Assert.Equal(2, result.Count);
    Assert.Contains(result, b => b.Title == "Book 1");
    Assert.Contains(result, b => b.Title == "Book 2");
  }

  [Fact]
  public async Task GetBookById_WithValidId_ShouldReturnBook()
  {
    // Arrange
    var book = new Book { Title = "Test Book", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
    Context.Books.Add(book);
    await Context.SaveChangesAsync();

    // Act
    var result = await _query.GetBookById(book.Id, Context);

    // Assert
    Assert.NotNull(result);
    Assert.Equal("Test Book", result.Title);
    Assert.Equal(book.Id, result.Id);
  }

  [Fact]
  public async Task GetBookById_WithInvalidId_ShouldReturnNull()
  {
    // Act
    var result = await _query.GetBookById(999, Context);

    // Assert
    Assert.Null(result);
  }

  [Fact]
  public void GetAuthors_WithEmptyDatabase_ShouldReturnEmptyQueryable()
  {
    // Act
    var result = _query.GetAuthors(Context);

    // Assert
    Assert.NotNull(result);
    Assert.Empty(result.ToList());
  }

  [Fact]
  public void GetAuthors_WithAuthorsInDatabase_ShouldReturnAllAuthors()
  {
    // Arrange
    var author1 = new Author { Name = "Author 1", CreatedAt = DateTime.UtcNow };
    var author2 = new Author { Name = "Author 2", CreatedAt = DateTime.UtcNow };

    Context.Authors.AddRange(author1, author2);
    Context.SaveChanges();

    // Act
    var result = _query.GetAuthors(Context).ToList();

    // Assert
    Assert.NotNull(result);
    Assert.Equal(2, result.Count);
    Assert.Contains(result, a => a.Name == "Author 1");
    Assert.Contains(result, a => a.Name == "Author 2");
  }

  [Fact]
  public void GetCategories_WithEmptyDatabase_ShouldReturnEmptyQueryable()
  {
    // Act
    var result = _query.GetCategories(Context);

    // Assert
    Assert.NotNull(result);
    Assert.Empty(result.ToList());
  }

  [Fact]
  public void GetCategories_WithCategoriesInDatabase_ShouldReturnAllCategories()
  {
    // Arrange
    var category1 = new Category { Name = "Fiction", CreatedAt = DateTime.UtcNow };
    var category2 = new Category { Name = "Non-Fiction", CreatedAt = DateTime.UtcNow };

    Context.Categories.AddRange(category1, category2);
    Context.SaveChanges();

    // Act
    var result = _query.GetCategories(Context).ToList();

    // Assert
    Assert.NotNull(result);
    Assert.Equal(2, result.Count);
    Assert.Contains(result, c => c.Name == "Fiction");
    Assert.Contains(result, c => c.Name == "Non-Fiction");
  }
}