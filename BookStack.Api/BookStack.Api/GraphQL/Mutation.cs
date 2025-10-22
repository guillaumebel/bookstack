using BookStack.Api.Data;
using BookStack.Api.Models;
using BookStack.Api.Models.Mutations;
using BookStack.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace BookStack.Api.GraphQL;

public class Mutation
{
  public async Task<Book> AddBook(AddBookInput input, [Service] BookStackContext context)
  {
    var book = new Book
    {
      Title = input.Title,
      Isbn = input.Isbn,
      Description = input.Description,
      PublishedDate = input.PublishedDate,
      PageCount = input.PageCount,
      Thumbnail = input.Thumbnail,
      Language = input.Language,
      GoogleBooksId = input.GoogleBooksId,
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };

    context.Books.Add(book);
    await context.SaveChangesAsync();

    if (input.AuthorIds != null && input.AuthorIds.Any())
    {
      foreach (var authorId in input.AuthorIds)
      {
        context.BookAuthors.Add(new BookAuthor { BookId = book.Id, AuthorId = authorId });
      }
    }

    if (input.CategoryIds != null && input.CategoryIds.Any())
    {
      foreach (var categoryId in input.CategoryIds)
      {
        context.BookCategories.Add(new BookCategory { BookId = book.Id, CategoryId = categoryId });
      }
    }

    await context.SaveChangesAsync();
    return book;
  }

  public async Task<Book> UpdateBook(int id, UpdateBookInput input, [Service] BookStackContext context)
  {
    var book = await context.Books.FindAsync(id);
    if (book == null)
      throw new Exception("Book not found");

    if (input.Title != null) book.Title = input.Title;
    if (input.Isbn != null) book.Isbn = input.Isbn;
    if (input.Description != null) book.Description = input.Description;
    if (input.PublishedDate.HasValue) book.PublishedDate = input.PublishedDate;
    if (input.PageCount.HasValue) book.PageCount = input.PageCount;
    if (input.Thumbnail != null) book.Thumbnail = input.Thumbnail;
    if (input.Language != null) book.Language = input.Language;

    book.UpdatedAt = DateTime.UtcNow;

    await context.SaveChangesAsync();
    return book;
  }

  public async Task<bool> DeleteBook(int id, [Service] BookStackContext context)
  {
    var book = await context.Books.FindAsync(id);
    if (book == null)
      return false;

    context.Books.Remove(book);
    await context.SaveChangesAsync();
    return true;
  }

  public async Task<Author> AddAuthor(string name, [Service] BookStackContext context)
  {
    var author = new Author
    {
      Name = name,
      CreatedAt = DateTime.UtcNow
    };

    context.Authors.Add(author);
    await context.SaveChangesAsync();
    return author;
  }

  public async Task<Category> AddCategory(string name, [Service] BookStackContext context)
  {
    var category = new Category
    {
      Name = name,
      CreatedAt = DateTime.UtcNow
    };

    context.Categories.Add(category);
    await context.SaveChangesAsync();
    return category;
  }

  public async Task<Book> ImportBookFromGoogle(string googleBooksId, [Service] GoogleBooksService googleBooksService, [Service] BookStackContext context)
  {
    var googleBook = await googleBooksService.GetBookByIdAsync(googleBooksId);
    if (googleBook == null)
      throw new Exception("Book not found in Google Books");

    var existingBook = await context.Books.FirstOrDefaultAsync(b => b.GoogleBooksId == googleBooksId);
    if (existingBook != null)
      throw new Exception("Book already exists in catalog");

    var book = new Book
    {
      Title = googleBook.VolumeInfo.Title,
      Description = googleBook.VolumeInfo.Description,
      PublishedDate = DateTime.TryParse(googleBook.VolumeInfo.PublishedDate, out var date) ? date : null,
      PageCount = googleBook.VolumeInfo.PageCount,
      Thumbnail = googleBook.VolumeInfo.ImageLinks?.Thumbnail,
      Language = googleBook.VolumeInfo.Language,
      GoogleBooksId = googleBook.Id,
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };

    var isbn13 = googleBook.VolumeInfo.IndustryIdentifiers?.FirstOrDefault(i => i.Type == "ISBN_13");
    var isbn10 = googleBook.VolumeInfo.IndustryIdentifiers?.FirstOrDefault(i => i.Type == "ISBN_10");
    book.Isbn = isbn13?.Identifier ?? isbn10?.Identifier;

    context.Books.Add(book);
    await context.SaveChangesAsync();

    if (googleBook.VolumeInfo.Authors != null && googleBook.VolumeInfo.Authors.Any())
    {
      foreach (var authorName in googleBook.VolumeInfo.Authors)
      {
        var author = await context.Authors.FirstOrDefaultAsync(a => a.Name == authorName);
        if (author == null)
        {
          author = new Author { Name = authorName, CreatedAt = DateTime.UtcNow };
          context.Authors.Add(author);
          await context.SaveChangesAsync();
        }

        context.BookAuthors.Add(new BookAuthor { BookId = book.Id, AuthorId = author.Id });
      }
    }

    if (googleBook.VolumeInfo.Categories != null && googleBook.VolumeInfo.Categories.Any())
    {
      foreach (var categoryName in googleBook.VolumeInfo.Categories)
      {
        var category = await context.Categories.FirstOrDefaultAsync(c => c.Name == categoryName);
        if (category == null)
        {
          category = new Category { Name = categoryName, CreatedAt = DateTime.UtcNow };
          context.Categories.Add(category);
          await context.SaveChangesAsync();
        }

        context.BookCategories.Add(new BookCategory { BookId = book.Id, CategoryId = category.Id });
      }
    }

    await context.SaveChangesAsync();
    return await context.Books
        .Include(b => b.BookAuthors).ThenInclude(ba => ba.Author)
        .Include(b => b.BookCategories).ThenInclude(bc => bc.Category)
        .FirstAsync(b => b.Id == book.Id);
  }
}



