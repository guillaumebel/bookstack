using BookStack.Api.Data;
using Microsoft.EntityFrameworkCore;
namespace BookStack.Api.Tests;

public abstract class DatabaseTestBase : IDisposable
{
  protected BookStackContext Context { get; private set; }

  protected DatabaseTestBase()
  {
    var options = new DbContextOptionsBuilder<BookStackContext>()
        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
        .Options;

    Context = new BookStackContext(options);
    Context.Database.EnsureCreated();
  }

  public virtual void Dispose()
  {
    Context?.Dispose();
  }
}