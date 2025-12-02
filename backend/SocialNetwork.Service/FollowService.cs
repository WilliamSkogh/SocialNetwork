using Socialnetwork.Repository;
using SocialNetwork.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Service;

public class FollowService
{
    private readonly IFollowRepository _repo;

    public FollowService(IFollowRepository repo)
    {
        _repo = repo;
    }
    public async Task FollowUserAsync(string followerId, string followingId)
    {
        bool alreadyFolllowing = await _repo.IsFollowingAsync(followerId, followingId);
        if (alreadyFolllowing)
            return;

        var follower = await _repo.GetUserByIdAsync(followerId);
        var following = await _repo.GetUserByIdAsync(followingId);

        if (followerId == followingId)
            throw new Exception("You cannot follow yourself.");

        if (follower == null || following == null)
            throw new Exception("Invalid user ID");

        var newFollow = new Follow
        {
            FollowerId = followerId,
            FollowingId = followingId,
            FollowedAt = DateTime.UtcNow
        };
        await _repo.AddFollowAsync(newFollow);

        follower.FollowingCount++;
        following.FollowerCount++;

        await _repo.SaveChangesAsync();
    }
}
