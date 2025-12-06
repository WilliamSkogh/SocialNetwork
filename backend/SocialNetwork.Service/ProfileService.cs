using Microsoft.AspNetCore.Http;
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
    private readonly IMediaUploadService _mediaService;
    public ProfileService(IProfileRepository repo, IMediaUploadService mediaService)
    {
        _repo = repo;
        _mediaService = mediaService;
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
    public async Task UpdateUserProfileAsync(string username, string newBio, IFormFile? imageFile)
    {
        if (newBio != null && newBio.Length > 500)
        {
            throw new ArgumentException("Bio cannot exceed 500 characters.");
        }

        var user = await _repo.GetUserByUsernameAsync(username);

        if (user == null)throw new Exception("User not found");

        user.Bio = newBio ?? user.Bio;

        if (imageFile != null)
        {
            try
            {
                var imagePath = await _mediaService.UploadFileAsync(imageFile, "profiles");
                user.ProfileImageUrl = imagePath;
            }
            catch (Exception ex) 
            {
                throw new ArgumentException(ex.Message);
            }
        }

        await _repo.UpdateUserAsync(user); 
    }
}
