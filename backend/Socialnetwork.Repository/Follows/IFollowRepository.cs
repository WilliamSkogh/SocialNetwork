using SocialNetwork.Entity;

namespace Socialnetwork.Repository
{
    public interface IFollowRepository
    {
        Task<bool> IsFollowingAsync(string followerId, string followingId);
        Task AddFollowAsync(Follow follow);
        Task SaveChangesAsync();
        Task<ApplicationUser?> GetUserByIdAsync(string userId);

        Task<Follow?> GetFollowAsync(string followerId, string followingId);
        Task RemoveFollowAsync(Follow follow);
    }
}
