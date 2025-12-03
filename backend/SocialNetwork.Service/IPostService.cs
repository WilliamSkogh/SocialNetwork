using SocialNetwork.Entity;
using System.Threading.Tasks;

namespace SocialNetwork.Service
{
    public interface IPostService
    {
        Task<Post> CreatePostAsync(Post post);
    }
}
