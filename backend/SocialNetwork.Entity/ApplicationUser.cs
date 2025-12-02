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
        if (targetUser == null)
            throw new ArgumentNullException(nameof(targetUser), "Cannot follow a null user.");

        this.FollowingCount++;
        targetUser.FollowerCount++;
    }

}