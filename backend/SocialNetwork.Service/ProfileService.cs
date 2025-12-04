using Socialnetwork.Repository.Profile;
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

}
