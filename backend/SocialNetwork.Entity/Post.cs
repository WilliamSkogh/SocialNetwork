namespace SocialNetwork.Entity;

public class Post
{
    public int Id { get; set; }
    public string AuthorId { get; set; } = string.Empty;
    public string RecipientId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ApplicationUser? Author { get; set; }
    public ApplicationUser? Recipient { get; set; }
}