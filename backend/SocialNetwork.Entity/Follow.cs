namespace SocialNetwork.Entity;
public class Follow
{
    public string FollowerId { get; set; } = null!;
    public ApplicationUser Follower { get; set; } = null!;
    public string FollowingId { get; set; } = null!;
    public ApplicationUser Following { get; set; } = null!;
    public DateTime FollowedAt { get; set; } = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time"));
}
