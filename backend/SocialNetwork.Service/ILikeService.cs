namespace SocialNetwork.Service;

public interface ILikeService
{
    Task<bool> AddLikeAsync(int postId, string userId);
    Task<bool> RemoveLikeAsync(int postId, string userId);
}
