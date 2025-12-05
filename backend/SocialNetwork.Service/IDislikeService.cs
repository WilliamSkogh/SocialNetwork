namespace SocialNetwork.Service;

public interface IDislikeService
{
    Task<bool> AddDislikeAsync(int postId, string userId);
    Task<bool> RemoveDislikeAsync(int postId, string userId);
}
