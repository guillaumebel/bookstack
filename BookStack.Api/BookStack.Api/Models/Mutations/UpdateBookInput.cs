namespace BookStack.Api.Models.Mutations;

public record UpdateBookInput(
    string? Title,
    string? Isbn,
    string? Description,
    DateTime? PublishedDate,
    int? PageCount,
    string? Thumbnail,
    string? Language
);