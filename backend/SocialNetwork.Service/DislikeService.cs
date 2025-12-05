using SocialNetwork.Entityframework;
using SocialNetwork.Entity;

namespace SocialNetwork.Service;

public class DislikeService : IDislikeService
{
    private readonly ApplicationDbContext _context;

    public DislikeService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AddDislikeAsync(int postId, string userId)
    {
        var dislike = new Dislike
        {
            PostId = postId,
            UserId = userId
        };

        _context.Set<Dislike>().Add(dislike);
        await _context.SaveChangesAsync();
        return true;
    }
}
