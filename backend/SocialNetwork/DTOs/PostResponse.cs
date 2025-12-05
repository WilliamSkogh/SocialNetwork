namespace SocialNetwork.Api.DTOs;

public record PostResponse(
    int Id,
    string AuthorId,
    string AuthorUsername,
    string? RecipientId,
    string Content,
    string? ImageUrl,
    DateTime CreatedAt,
    int LikesCount,
    int DislikesCount,
    List<CommentDto> Comments
);

public record CommentDto(
    int Id,
    string UserId,
    string Username,
    string Text,
    DateTime CreatedAt
);