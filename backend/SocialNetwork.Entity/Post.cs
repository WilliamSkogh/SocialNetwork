namespace SocialNetwork.Entity;

public class Post
{
    public int Id { get; set; }
    public string AuthorId { get; set; } = string.Empty;
    public string RecipientId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ApplicationUser Author { get; set; } = null!;
    public ApplicationUser Recipient { get; set; } = null!;
}