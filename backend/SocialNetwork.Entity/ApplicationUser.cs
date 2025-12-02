using Microsoft.AspNetCore.Identity;

namespace SocialNetwork.Entity;

public class ApplicationUser : IdentityUser
{
    public int FollowerCount { get; set; }
    public int FollowingCount { get; set; }

    public virtual ICollection<Follow> Followers { get; set; }
    public virtual ICollection<Follow> Following { get; set; }

    public void Follow(ApplicationUser targetUser)
    {
        ArgumentNullException.ThrowIfNull(targetUser);

        this.FollowingCount++;
        targetUser.FollowerCount++;
    }
    public void Unfollow(ApplicationUser targetUser)
    {
        ArgumentNullException.ThrowIfNull(targetUser);

        if (this.FollowingCount > 0) this.FollowingCount--;
        if (targetUser.FollowerCount > 0) targetUser.FollowerCount--;
    }

}