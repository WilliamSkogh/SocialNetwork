namespace SocialNetwork.Service;

public interface ILikeService
{
    Task<bool> AddLikeAsync(int postId, string userId);
}
