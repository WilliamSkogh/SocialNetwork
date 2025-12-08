using Microsoft.AspNetCore.Http;
using Socialnetwork.Repository.Profile;
using Socialnetwork.Repository;
using SocialNetwork.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SocialNetwork.Service.DTOs;

namespace SocialNetwork.Service;

public class ProfileService : IProfileService
{
    private readonly IProfileRepository _repo;
    private readonly IMediaUploadService _mediaService;
    private readonly IFollowRepository _followRepo;
    public ProfileService(IProfileRepository repo, IMediaUploadService mediaService, IFollowRepository followRepo)
    {
        _repo = repo;
        _mediaService = mediaService;
        _followRepo = followRepo;
    }
    

public async Task<UserProfile?> GetUserProfileAsync(string userName, string? currentUserId = null)
    {
        var user =  await _repo.GetUserByUsernameAsync(userName);
       
        if (user == null) return null;

        bool isFollowing = false;
        if (!string.IsNullOrEmpty(currentUserId) && currentUserId != user.Id)
        {
            isFollowing = await _followRepo.IsFollowingAsync(currentUserId, user.Id);
        }

        return new UserProfile
        {
            UserId = user.Id,
            UserName = user.UserName,
            Bio = user.Bio,
            ProfileImageUrl = user.ProfileImageUrl,
            FollowerCount = user.FollowerCount,
            FollowingCount = user.FollowingCount,
            IsFollowing = isFollowing
        };
    }

    public async Task<List<UserSearchResultDto>> SearchUsersAsync(string query, int take = 5)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new List<UserSearchResultDto>();
        }

        var users = await _repo.SearchUsersAsync(query, take);

        return users.Select(u => new UserSearchResultDto
        {
            Id = u.Id,
            Username = u.UserName,
            Bio = u.Bio,
            ProfileImageUrl = u.ProfileImageUrl
        }).ToList();
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
