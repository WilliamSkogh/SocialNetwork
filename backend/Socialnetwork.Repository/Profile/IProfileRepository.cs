using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SocialNetwork.Entity;
namespace Socialnetwork.Repository.Profile;

public interface IProfileRepository
{
    Task<ApplicationUser?> GetUserByUsernameAsync(string userName);
}
