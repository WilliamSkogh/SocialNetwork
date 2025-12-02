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
        if (followerId == followingId)
            throw new Exception("You cannot follow yourself.");

        if (await _repo.IsFollowingAsync(followerId, followingId))
            return;

        var follower = await _repo.GetUserByIdAsync(followerId);
        var following = await _repo.GetUserByIdAsync(followingId);

        if (follower == null || following == null)
            throw new Exception("Invalid user ID.");

        follower.Follow(following);

        await CreateFollowRelationAsync(followerId, followingId);


        await _repo.SaveChangesAsync();
    }
    private async Task CreateFollowRelationAsync(string followerId, string followingId)
    {
        var follow = new Follow
        {
            FollowerId = followerId,
            FollowingId = followingId,
            FollowedAt = DateTime.UtcNow
        };
        await _repo.AddFollowAsync(follow);
    }

    public async Task UnfollowUserAsync(string followerId, string followingId)
    {
        var follow = await _repo.GetFollowAsync(followerId, followingId);

        if (follow == null)
            return;

        var follower = await _repo.GetUserByIdAsync(followerId);
        var following = await _repo.GetUserByIdAsync(followingId);

        if (follower == null || following == null)
            throw new Exception("Invalid user ID.");

        follower.Unfollow(following);

        await _repo.RemoveFollowAsync(follow);
        await _repo.SaveChangesAsync();
    }
}
