namespace SocialNetwork.Api.DTOs;

public record PostResponse(
    int Id,
    string AuthorId,
    string? RecipientId,
    string Content,
    DateTime CreatedAt
);