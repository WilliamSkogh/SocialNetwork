using SocialNetwork.Entityframework;
using SocialNetwork.Entity;
using Microsoft.EntityFrameworkCore;

namespace SocialNetwork.Service;

public class LikeService : ILikeService
{
    private readonly ApplicationDbContext _context;

    public LikeService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AddLikeAsync(int postId, string userId)
    {
        var existingLike = await _context.Set<Like>()
            .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

        if (existingLike != null)
            return false;

        var like = new Like
        {
            PostId = postId,
            UserId = userId
        };

        _context.Set<Like>().Add(like);
        await _context.SaveChangesAsync();
        return true;
    }
}
