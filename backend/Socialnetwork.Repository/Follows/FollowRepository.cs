using SocialNetwork.Entity;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entityframework;

namespace Socialnetwork.Repository;

public class FollowRepository : IFollowRepository
{
    private readonly ApplicationDbContext _context;

    public FollowRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApplicationUser?> GetUserByIdAsync(string userId)
    {
        return await _context.Users.FindAsync(userId);
    }

    public async Task<bool> IsFollowingAsync(string followerId, string followingId)
    {
        return await _context.Follows.AnyAsync(f =>
            f.FollowerId == followerId &&
            f.FollowingId == followingId);
    }

    public async Task AddFollowAsync(Follow follow)
    {
        await _context.Follows.AddAsync(follow);
    }

    public async Task<Follow?> GetFollowAsync(string followerId, string followingId)
    {

        return await _context.Follows
            .Include(f => f.Follower)
            .Include(f => f.Following)
            .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);
    }

    public Task RemoveFollowAsync(Follow follow)
    {
        _context.Follows.Remove(follow);
        return Task.CompletedTask;
    }

    public async Task<List<string>> GetFollowingIdsAsync(string userId)
    {
        return await _context.Follows
            .Where(f => f.FollowerId == userId)
            .Select(f => f.FollowingId)
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}