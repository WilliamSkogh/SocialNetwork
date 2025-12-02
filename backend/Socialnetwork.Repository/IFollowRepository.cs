using SocialNetwork.Entity;

namespace Socialnetwork.Repository
{
    public interface IFollowRepository
    {
        Task<bool> IsFollowingAsync(string followerId, string followingId);
        Task<bool> AddFollowAsync(Follow follow);
        Task<bool> SaveChangesAsync();
        Task<ApplicationUser> GetUserByIdAsync(string userId);
    }
}
