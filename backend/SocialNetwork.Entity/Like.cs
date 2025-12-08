namespace SocialNetwork.Entity;

public class Like
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Post? Post { get; set; }
    public ApplicationUser? User { get; set; }
}
