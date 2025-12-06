namespace SocialNetwork.Api.DTOs;

public record PostResponse(
    int Id,
    string AuthorId,
    string AuthorUsername,
    string? RecipientId,
    string? RecipientUsername,
    string Content,
    string? ImageUrl,
    DateTime CreatedAt,
    int LikesCount,
    int DislikesCount,
    bool HasLiked,
    bool HasDisliked,
    List<CommentDto> Comments
);

public record CommentDto(
    int Id,
    string UserId,
    string Username,
    string Text,
    DateTime CreatedAt
);