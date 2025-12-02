namespace SocialNetwork.Entity;
public class Follow
{
    public string FollowerId { get; set; }
    public ApplicationUser Follower { get; set; }
    public string FollowingId { get; set; }
    public ApplicationUser Following { get; set; }
    public DateTime FollowedAt { get; set; } = DateTime.UtcNow;
}
