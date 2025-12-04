using SocialNetwork.Entity;


namespace Socialnetwork.Repository.Profile;

public class ProfileRepository : IProfileRepository
{
    public Task<ApplicationUser?> GetUserByUsernameAsync(string userName)
    {
        throw new NotImplementedException();
    }
    public Task UpdateUserAsync(ApplicationUser user)
    {
        throw new NotImplementedException();
    }
}
