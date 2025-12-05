namespace SocialNetwork.Entity;

public class Post
{
    public int Id { get; set; }
    public string AuthorId { get; set; } = string.Empty;
    public string? RecipientId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ApplicationUser? Author { get; set; }
    public ApplicationUser? Recipient { get; set; }
    public ICollection<Like> Likes { get; set; } = new List<Like>();
    public ICollection<Dislike> Dislikes { get; set; } = new List<Dislike>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}