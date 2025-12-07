namespace SocialNetwork.Api.DTOs;

public record PostRequest(
    string AuthorId,
    string? RecipientId,
    string Content,
    string? ImageUrl
);