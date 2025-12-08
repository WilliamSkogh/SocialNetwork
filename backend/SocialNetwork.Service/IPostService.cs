using SocialNetwork.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialNetwork.Service
{
    public interface IPostService
    {
        Task<Post> CreatePostAsync(Post post);
        Task<Post?> GetPostByIdAsync(int id);
        Task<IEnumerable<Post>> GetAllPostsAsync();
        Task<IEnumerable<Post>> GetFollowingPostsAsync(string userId);
        Task<IEnumerable<Post>> GetUserProfilePostsAsync(string userId);
        Task<Post?> UpdatePostAsync(int id, string content);
        Task<bool> DeletePostAsync(int id);
    }
}
