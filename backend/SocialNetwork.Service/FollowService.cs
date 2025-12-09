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
        if (followerId == followingId) throw new Exception("You cannot follow yourself.");
        if (await _repo.IsFollowingAsync(followerId, followingId)) return;

        var (follower, following) = await GetUserOrThrowAsync(followerId, followingId);

        follower.Follow(following);

        await CreateFollowRelationAsync(followerId, followingId);
        await _repo.SaveChangesAsync();
    }

    private async Task CreateFollowRelationAsync(string followerId, string followingId)
    {
        var follow = new Follow
        {
            FollowerId = followerId,
            FollowingId = followingId
        };
        await _repo.AddFollowAsync(follow);
    }

    public async Task UnfollowUserAsync(string followerId, string followingId)
    {
        var follow = await _repo.GetFollowAsync(followerId, followingId);

        if (follow == null)
            return;

        var (follower, following) = await GetUserOrThrowAsync(followerId, followingId);

        follower.Unfollow(following);

        await _repo.RemoveFollowAsync(follow);
        await _repo.SaveChangesAsync();
    }
    private async Task<(ApplicationUser, ApplicationUser)> GetUserOrThrowAsync(string id1, string id2)
    {
        var user1 = await _repo.GetUserByIdAsync(id1);
        var user2 = await _repo.GetUserByIdAsync(id2);

        if (user1 == null || user2 == null)
            throw new Exception("Invalid user ID.");

        return (user1, user2);
    }
}
