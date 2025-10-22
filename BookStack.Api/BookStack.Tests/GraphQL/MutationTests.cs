using BookStack.Api.GraphQL;
using BookStack.Api.Models;
using BookStack.Api.Models.Mutations;

namespace BookStack.Api.Tests.GraphQL;

public class MutationTests : DatabaseTestBase
{
  private readonly Mutation _mutation;

  public MutationTests()
  {
    _mutation = new Mutation();
  }

  [Fact]
  public async Task AddBook_WithValidInput_ShouldCreateBook()
  {
    // Arrange
    var input = new AddBookInput(
        Title: "Test Book",
        Isbn: "1234567890123",
        Description: "Test Description",
        PublishedDate: new DateTime(2023, 1, 1),
        PageCount: 200,
        Thumbnail: "http://example.com/thumbnail.jpg",
        Language: "en",
        GoogleBooksId: "google123",
        AuthorIds: null,
        CategoryIds: null
    );

    // Act
    var result = await _mutation.AddBook(input, Context);

    // Assert
    Assert.NotNull(result);
    Assert.Equal("Test Book", result.Title);
    Assert.Equal("1234567890123", result.Isbn);
    Assert.Equal("Test Description", result.Description);
    Assert.Equal(new DateTime(2023, 1, 1), result.PublishedDate);
    Assert.Equal(200, result.PageCount);
    Assert.Equal("http://example.com/thumbnail.jpg", result.Thumbnail);
    Assert.Equal("en", result.Language);
    Assert.Equal("google123", result.GoogleBooksId);
    Assert.True(result.Id > 0);
    Assert.True(result.CreatedAt > DateTime.MinValue);
    Assert.True(result.UpdatedAt > DateTime.MinValue);
  }

  [Fact]
  public async Task AddBook_WithAuthorsAndCategories_ShouldCreateRelationships()
  {
    // Arrange
    var author = new Author { Name = "Test Author", CreatedAt = DateTime.UtcNow };
    var category = new Category { Name = "Test Category", CreatedAt = DateTime.UtcNow };

    Context.Authors.Add(author);
    Context.Categories.Add(category);
    await Context.SaveChangesAsync();

    var input = new AddBookInput(
        Title: "Test Book",
        Isbn: null,
        Description: null,
        PublishedDate: null,
        PageCount: null,
        Thumbnail: null,
        Language: null,
        GoogleBooksId: null,
        AuthorIds: new List<int> { author.Id },
        CategoryIds: new List<int> { category.Id }
    );

    // Act
    var result = await _mutation.AddBook(input, Context);

    // Assert
    Assert.NotNull(result);

    var bookAuthors = Context.BookAuthors.Where(ba => ba.BookId == result.Id).ToList();
    var bookCategories = Context.BookCategories.Where(bc => bc.BookId == result.Id).ToList();

    Assert.Single(bookAuthors);
    Assert.Equal(author.Id, bookAuthors.First().AuthorId);

    Assert.Single(bookCategories);
    Assert.Equal(category.Id, bookCategories.First().CategoryId);
  }

  [Fact]
  public async Task UpdateBook_WithValidId_ShouldUpdateBook()
  {
    // Arrange
    var book = new Book
    {
      Title = "Original Title",
      Isbn = "1111111111111",
      Description = "Original Description",
      CreatedAt = DateTime.Now,
      UpdatedAt = DateTime.Now
    };

    Context.Books.Add(book);
    await Context.SaveChangesAsync();

    var input = new UpdateBookInput(
        Title: "Updated Title",
        Isbn: "2222222222222",
        Description: "Updated Description",
        PublishedDate: new DateTime(2024, 1, 1),
        PageCount: 300,
        Thumbnail: "http://example.com/new-thumbnail.jpg",
        Language: "es"
    );
    // Ensure UpdatedAt will be different

    // Act
    var result = await _mutation.UpdateBook(book.Id, input, Context);

    // Assert
    Assert.NotNull(result);
    Assert.Equal("Updated Title", result.Title);
    Assert.Equal("2222222222222", result.Isbn);
    Assert.Equal("Updated Description", result.Description);
    Assert.Equal(new DateTime(2024, 1, 1), result.PublishedDate);
    Assert.Equal(300, result.PageCount);
    Assert.Equal("http://example.com/new-thumbnail.jpg", result.Thumbnail);
    Assert.Equal("es", result.Language);
  }

  [Fact]
  public async Task UpdateBook_WithInvalidId_ShouldThrowException()
  {
    // Arrange
    var input = new UpdateBookInput("Updated Title", null, null, null, null, null, null);

    // Act & Assert
    var exception = await Assert.ThrowsAsync<Exception>(() => _mutation.UpdateBook(999, input, Context));
    Assert.Equal("Book not found", exception.Message);
  }

  [Fact]
  public async Task DeleteBook_WithValidId_ShouldReturnTrue()
  {
    // Arrange
    var book = new Book
    {
      Title = "Book to Delete",
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };

    Context.Books.Add(book);
    await Context.SaveChangesAsync();

    // Act
    var result = await _mutation.DeleteBook(book.Id, Context);

    // Assert
    Assert.True(result);

    var deletedBook = await Context.Books.FindAsync(book.Id);
    Assert.Null(deletedBook);
  }

  [Fact]
  public async Task DeleteBook_WithInvalidId_ShouldReturnFalse()
  {
    // Act
    var result = await _mutation.DeleteBook(999, Context);

    // Assert
    Assert.False(result);
  }

  [Fact]
  public async Task AddAuthor_WithValidName_ShouldCreateAuthor()
  {
    // Arrange
    const string authorName = "Test Author";

    // Act
    var result = await _mutation.AddAuthor(authorName, Context);

    // Assert
    Assert.NotNull(result);
    Assert.Equal(authorName, result.Name);
    Assert.True(result.Id > 0);
    Assert.True(result.CreatedAt > DateTime.MinValue);
  }

  [Fact]
  public async Task AddCategory_WithValidName_ShouldCreateCategory()
  {
    // Arrange
    const string categoryName = "Test Category";

    // Act
    var result = await _mutation.AddCategory(categoryName, Context);

    // Assert
    Assert.NotNull(result);
    Assert.Equal(categoryName, result.Name);
    Assert.True(result.Id > 0);
    Assert.True(result.CreatedAt > DateTime.MinValue);
  }
}