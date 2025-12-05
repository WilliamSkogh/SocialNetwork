namespace SocialNetwork.Entity;

public class Comment
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public string UserId { get; set; }
    public string Text { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Post Post { get; set; }
    public ApplicationUser User { get; set; }
}
