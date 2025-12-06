using Microsoft.AspNetCore.Http;
using SocialNetwork.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Service;

public interface IProfileService
{
    Task<UserProfile?> GetUserProfileAsync(string userName, string? currentUserId = null);
     Task UpdateUserProfileAsync(string userName, string newBio, IFormFile? imageFile);
}
