namespace SocialNetwork.Service;

public record ActivityDto(
    string Type,
    string ActorId,
    string ActorUsername,
    string? ActorProfileImageUrl,
    int? PostId,
    string? PostContent,
    string? CommentText,
    DateTime CreatedAt
);

public interface IActivityService
{
    Task<IEnumerable<ActivityDto>> GetUserActivitiesAsync(string userId, int limit = 20);
}
