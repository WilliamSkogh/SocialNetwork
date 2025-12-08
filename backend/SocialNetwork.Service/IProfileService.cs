using Microsoft.AspNetCore.Http;
using SocialNetwork.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SocialNetwork.Service.DTOs;

namespace SocialNetwork.Service;

public interface IProfileService
{
    Task<UserProfile?> GetUserProfileAsync(string userName, string? currentUserId = null);
    Task<List<UserSearchResultDto>> SearchUsersAsync(string query, int take = 5);
    Task UpdateUserProfileAsync(string userName, string newBio, IFormFile? imageFile);
}
