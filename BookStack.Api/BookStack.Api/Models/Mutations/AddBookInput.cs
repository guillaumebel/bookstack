namespace BookStack.Api.Models.Mutations;

public record AddBookInput(
    string Title,
    string? Isbn,
    string? Description,
    DateTime? PublishedDate,
    int? PageCount,
    string? Thumbnail,
    string? Language,
    string? GoogleBooksId,
    List<int>? AuthorIds,
    List<int>? CategoryIds
);