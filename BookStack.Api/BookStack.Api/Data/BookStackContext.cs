using Microsoft.EntityFrameworkCore;
using BookStack.Api.Models;

namespace BookStack.Api.Data;

public class BookStackContext : DbContext
{
  public BookStackContext(DbContextOptions<BookStackContext> options)
      : base(options)
  {
  }

  public DbSet<Book> Books { get; set; }
  public DbSet<Author> Authors { get; set; }
  public DbSet<Category> Categories { get; set; }
  public DbSet<BookAuthor> BookAuthors { get; set; }
  public DbSet<BookCategory> BookCategories { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<BookAuthor>()
        .HasKey(ba => new { ba.BookId, ba.AuthorId });

    modelBuilder.Entity<BookAuthor>()
        .HasOne(ba => ba.Book)
        .WithMany(b => b.BookAuthors)
        .HasForeignKey(ba => ba.BookId);

    modelBuilder.Entity<BookAuthor>()
        .HasOne(ba => ba.Author)
        .WithMany(a => a.BookAuthors)
        .HasForeignKey(ba => ba.AuthorId);

    modelBuilder.Entity<BookCategory>()
        .HasKey(bc => new { bc.BookId, bc.CategoryId });

    modelBuilder.Entity<BookCategory>()
        .HasOne(bc => bc.Book)
        .WithMany(b => b.BookCategories)
        .HasForeignKey(bc => bc.BookId);

    modelBuilder.Entity<BookCategory>()
        .HasOne(bc => bc.Category)
        .WithMany(c => c.BookCategories)
        .HasForeignKey(bc => bc.CategoryId);

    modelBuilder.Entity<Book>()
        .HasIndex(b => b.GoogleBooksId)
        .IsUnique();

    modelBuilder.Entity<Book>()
        .Property(b => b.PublishedDate)
        .HasConversion(
            v => v!.Value.ToUniversalTime(),
            v => DateTime.SpecifyKind(v!, DateTimeKind.Utc));

    modelBuilder.Entity<Book>()
        .Property(b => b.CreatedAt)
        .HasConversion(
            v => v!.ToUniversalTime(),
            v => DateTime.SpecifyKind(v!, DateTimeKind.Utc));

    modelBuilder.Entity<Book>()
        .Property(b => b.UpdatedAt)
        .HasConversion(
            v => v!.ToUniversalTime(),
            v => DateTime.SpecifyKind(v!, DateTimeKind.Utc));

    modelBuilder.Entity<Author>()
        .HasIndex(a => a.Name);

    modelBuilder.Entity<Category>()
        .HasIndex(c => c.Name);
  }
}
