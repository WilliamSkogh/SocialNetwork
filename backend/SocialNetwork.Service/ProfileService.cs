using Socialnetwork.Repository.Profile;
using SocialNetwork.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Service;

public class ProfileService
{
    private readonly IProfileRepository _repo;
    public ProfileService(IProfileRepository repo)
    {
        _repo = repo;
    }

    public async Task<UserProfile?> GetProfileAsync(string userName)
    {
        var user =  await _repo.GetUserByUsernameAsync(userName);

        if (user == null) return null;

        return new UserProfile
        {
            UserName = user.UserName,
            Bio = user.Bio,
            ProfileImageUrl = user?.ProfileImageUrl,
            FollowerCount = user.FollowerCount,
            FollowingCount = user.FollowingCount
        };
    }

}
