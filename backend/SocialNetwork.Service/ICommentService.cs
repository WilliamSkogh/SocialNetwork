namespace SocialNetwork.Service;

public interface ICommentService
{
    Task<bool> AddCommentAsync(int postId, string userId, string text);
    Task<bool> RemoveCommentAsync(int commentId);
}
