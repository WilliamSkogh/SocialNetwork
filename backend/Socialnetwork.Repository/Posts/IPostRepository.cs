using SocialNetwork.Entity;

namespace SocialNetwork.Repository.Posts;

public interface IPostRepository
{
    Task<Post> CreateAsync(Post post);
    Task<Post?> GetByIdAsync(int id);
    Task<IEnumerable<Post>> GetAllAsync();
    Task<Post?> UpdateAsync(Post post);
    Task<bool> DeleteAsync(int id);
}
