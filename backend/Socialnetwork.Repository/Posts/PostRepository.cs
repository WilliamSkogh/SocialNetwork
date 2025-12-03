using SocialNetwork.Entity;
using SocialNetwork.Entityframework;

namespace SocialNetwork.Repository.Posts;

public class PostRepository : IPostRepository
{
    private readonly ApplicationDbContext _context;

    public PostRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<Post> CreateAsync(Post post)
    {
        throw new NotImplementedException();
    }
}
