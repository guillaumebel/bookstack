using BookStack.Api.Data;
using BookStack.Api.GraphQL;
using BookStack.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BookStackContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient<GoogleBooksService>();

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
        .AddTypeExtension<GoogleBooksQuery>()
    .AddMutationType<Mutation>()
    .AddProjections()
    .AddFiltering()
    .AddSorting();

builder.Services.AddCors(options =>
{
  options.AddDefaultPolicy(policy =>
  {
    policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
  });
});

// Add health checks
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection")!);

var app = builder.Build();

app.UseCors();

app.UseHttpsRedirection();

// Add health check endpoint
app.MapHealthChecks("/health");

app.MapGraphQL();

app.Run();
