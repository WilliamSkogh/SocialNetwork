using SocialNetwork.Entity;

namespace SocialNetwork.Repository.Posts;

public interface IPostRepository
{
    Task<Post> CreateAsync(Post post);
    Task<Post?> GetByIdAsync(int id);
}
