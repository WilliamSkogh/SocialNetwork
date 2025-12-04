using SocialNetwork.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Service;

public interface IProfileService
{
    Task<UserProfile?> GetUserProfileAsync(string userName);
     Task UpdateUserProfileAsync(string userName, string newBio, string newImageUrl);
}
