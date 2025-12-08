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
        var activities = new List<ActivityDto>();

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

        var dislikes = await _context.Set<Dislike>()
            .Where(d => d.Post!.AuthorId == userId && d.UserId != userId)
            .Include(d => d.User)
            .Include(d => d.Post)
            .OrderByDescending(d => d.CreatedAt)
            .Take(limit)
            .Select(d => new ActivityDto(
                "dislike",
                d.UserId,
                d.User!.UserName ?? "Unknown",
                d.User.ProfileImageUrl,
                d.PostId,
                d.Post!.Content,
                null,
                d.CreatedAt
            ))
            .ToListAsync();

        var comments = await _context.Set<Comment>()
            .Where(c => c.Post!.AuthorId == userId && c.UserId != userId)
            .Include(c => c.User)
            .Include(c => c.Post)
            .OrderByDescending(c => c.CreatedAt)
            .Take(limit)
            .Select(c => new ActivityDto(
                "comment",
                c.UserId,
                c.User!.UserName ?? "Unknown",
                c.User.ProfileImageUrl,
                c.PostId,
                c.Post!.Content,
                c.Text,
                c.CreatedAt
            ))
            .ToListAsync();

        var follows = await _context.Set<Follow>()
            .Where(f => f.FollowingId == userId)
            .Include(f => f.Follower)
            .OrderByDescending(f => f.FollowedAt)
            .Take(limit)
            .Select(f => new ActivityDto(
                "follow",
                f.FollowerId,
                f.Follower!.UserName ?? "Unknown",
                f.Follower.ProfileImageUrl,
                null,
                null,
                null,
                f.FollowedAt
            ))
            .ToListAsync();

        activities.AddRange(likes);
        activities.AddRange(dislikes);
        activities.AddRange(comments);
        activities.AddRange(follows);

        return activities.OrderByDescending(a => a.CreatedAt).Take(limit);
    }
}
