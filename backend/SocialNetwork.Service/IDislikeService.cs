namespace SocialNetwork.Service;

public interface IDislikeService
{
    Task<bool> AddDislikeAsync(int postId, string userId);
}
