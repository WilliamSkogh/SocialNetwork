using Microsoft.EntityFrameworkCore;
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
        var existingDislike = await _context.Set<Dislike>()
            .FirstOrDefaultAsync(d => d.PostId == postId && d.UserId == userId);
        
        if (existingDislike != null)
        {
            return false;
        }

        var dislike = new Dislike
        {
            PostId = postId,
            UserId = userId
        };

        _context.Set<Dislike>().Add(dislike);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveDislikeAsync(int postId, string userId)
    {
        var dislike = await _context.Set<Dislike>()
            .FirstOrDefaultAsync(d => d.PostId == postId && d.UserId == userId);
        
        if (dislike == null)
        {
            return false;
        }

        _context.Set<Dislike>().Remove(dislike);
        await _context.SaveChangesAsync();
        return true;
    }
}
