using Socialnetwork.Repository;
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
        throw new NotImplementedException();
    }
}
