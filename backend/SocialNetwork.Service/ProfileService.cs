using Socialnetwork.Repository.Profile;
using SocialNetwork.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Service;

public class ProfileService : IProfileService
{
    private readonly IProfileRepository _repo;
    public ProfileService(IProfileRepository repo)
    {
        _repo = repo;
    }
    

public async Task<UserProfile?> GetUserProfileAsync(string userName)
    {
        var user =  await _repo.GetUserByUsernameAsync(userName);
       
        if (user == null) return null;

        return new UserProfile
        {
            UserName = user.UserName,
            Bio = user.Bio,
            ProfileImageUrl = user.ProfileImageUrl,
            FollowerCount = user.FollowerCount,
            FollowingCount = user.FollowingCount
        };
    }
    public async Task UpdateUserProfileAsync(string username, string newBio, string newImageUrl)
    {
        ValidateProfileUpdate(newBio, newImageUrl);

        var user = await _repo.GetUserByUsernameAsync(username);

        if (user == null)throw new Exception("User not found");

        user.Bio = newBio;
        user.ProfileImageUrl = newImageUrl;

        await _repo.UpdateUserAsync(user); 
    }
    private void ValidateProfileUpdate(string bio, string imageUrl)
    {
        if (bio.Length > 500)
        {
            throw new ArgumentException("Bio cannot exceed 500 characters.");
        }

        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            return;
        }
        bool isJpg = imageUrl.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) || imageUrl.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase);
        bool isPng = imageUrl.EndsWith(".png", StringComparison.OrdinalIgnoreCase);

        if (!isJpg && !isPng)
        {
            throw new ArgumentException("Invalid image format. Only .jpg, .jpeg and .png are allowed.");
        }
    }

}
