using BookStack.Api.Models;

namespace BookStack.Api.Tests.Models;

public class ModelTests : DatabaseTestBase
{
  [Fact]
  public async Task Book_CreateAndSave_ShouldPersistCorrectly()
  {
    // Arrange
    var book = new Book
    {
      Title = "Test Book",
      Isbn = "9781234567890",
      Description = "A test book description",
      PublishedDate = new DateTime(2023, 6, 15),
      PageCount = 300,
      Thumbnail = "http://example.com/thumbnail.jpg",
      Language = "en",
      GoogleBooksId = "google123",
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };

    // Act
    Context.Books.Add(book);
    await Context.SaveChangesAsync();

    // Assert
    Assert.True(book.Id > 0);
    var savedBook = await Context.Books.FindAsync(book.Id);
    Assert.NotNull(savedBook);
    Assert.Equal("Test Book", savedBook.Title);
    Assert.Equal("9781234567890", savedBook.Isbn);
    Assert.Equal("A test book description", savedBook.Description);
    Assert.Equal(new DateTime(2023, 6, 15), savedBook.PublishedDate);
    Assert.Equal(300, savedBook.PageCount);
    Assert.Equal("http://example.com/thumbnail.jpg", savedBook.Thumbnail);
    Assert.Equal("en", savedBook.Language);
    Assert.Equal("google123", savedBook.GoogleBooksId);
  }

  [Fact]
  public async Task Author_CreateAndSave_ShouldPersistCorrectly()
  {
    // Arrange
    var author = new Author
    {
      Name = "Test Author",
      CreatedAt = DateTime.UtcNow
    };

    // Act
    Context.Authors.Add(author);
    await Context.SaveChangesAsync();

    // Assert
    Assert.True(author.Id > 0);
    var savedAuthor = await Context.Authors.FindAsync(author.Id);
    Assert.NotNull(savedAuthor);
    Assert.Equal("Test Author", savedAuthor.Name);
  }

  [Fact]
  public async Task Category_CreateAndSave_ShouldPersistCorrectly()
  {
    // Arrange
    var category = new Category
    {
      Name = "Fiction",
      CreatedAt = DateTime.UtcNow
    };

    // Act
    Context.Categories.Add(category);
    await Context.SaveChangesAsync();

    // Assert
    Assert.True(category.Id > 0);
    var savedCategory = await Context.Categories.FindAsync(category.Id);
    Assert.NotNull(savedCategory);
    Assert.Equal("Fiction", savedCategory.Name);
  }

  [Fact]
  public async Task BookAuthor_Relationship_ShouldWorkCorrectly()
  {
    // Arrange
    var author = new Author { Name = "Test Author", CreatedAt = DateTime.UtcNow };
    var book = new Book { Title = "Test Book", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };

    Context.Authors.Add(author);
    Context.Books.Add(book);
    await Context.SaveChangesAsync();

    var bookAuthor = new BookAuthor { BookId = book.Id, AuthorId = author.Id };

    // Act
    Context.BookAuthors.Add(bookAuthor);
    await Context.SaveChangesAsync();

    // Assert
    var savedBookAuthor = Context.BookAuthors
        .Where(ba => ba.BookId == book.Id && ba.AuthorId == author.Id)
        .FirstOrDefault();

    Assert.NotNull(savedBookAuthor);
    Assert.Equal(book.Id, savedBookAuthor.BookId);
    Assert.Equal(author.Id, savedBookAuthor.AuthorId);
  }

  [Fact]
  public async Task BookCategory_Relationship_ShouldWorkCorrectly()
  {
    // Arrange
    var category = new Category { Name = "Fiction", CreatedAt = DateTime.UtcNow };
    var book = new Book { Title = "Test Book", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };

    Context.Categories.Add(category);
    Context.Books.Add(book);
    await Context.SaveChangesAsync();

    var bookCategory = new BookCategory { BookId = book.Id, CategoryId = category.Id };

    // Act
    Context.BookCategories.Add(bookCategory);
    await Context.SaveChangesAsync();

    // Assert
    var savedBookCategory = Context.BookCategories
        .Where(bc => bc.BookId == book.Id && bc.CategoryId == category.Id)
        .FirstOrDefault();

    Assert.NotNull(savedBookCategory);
    Assert.Equal(book.Id, savedBookCategory.BookId);
    Assert.Equal(category.Id, savedBookCategory.CategoryId);
  }
}