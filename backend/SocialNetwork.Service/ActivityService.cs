using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;

namespace SocialNetwork.Service;

public class ActivityService : IActivityService
{
    private readonly ApplicationDbContext _context;

    public ActivityService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ActivityDto>> GetUserActivitiesAsync(string userId, int limit = 20)
    {
        var likes = await _context.Set<Like>()
            .Where(l => l.Post!.AuthorId == userId && l.UserId != userId)
            .Include(l => l.User)
            .Include(l => l.Post)
            .OrderByDescending(l => l.CreatedAt)
            .Take(limit)
            .Select(l => new ActivityDto(
                "like",
                l.UserId,
                l.User!.UserName ?? "Unknown",
                l.User.ProfileImageUrl,
                l.PostId,
                l.Post!.Content,
                null,
                l.CreatedAt
            ))
            .ToListAsync();

        return likes.OrderByDescending(a => a.CreatedAt).Take(limit);
    }
}
