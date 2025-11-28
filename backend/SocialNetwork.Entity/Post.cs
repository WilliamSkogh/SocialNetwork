namespace SocialNetwork.Entity;

public class Post
{
    public int Id { get; set; }
    public string AuthorId { get; set; } = string.Empty;
    public string RecipientId { get; set; } = string.Empty;
    
    private string _content = string.Empty;
    public string Content
    {
        get => _content;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Content cannot be empty");
            if (value.Length > 500)  
                throw new ArgumentException("Content cannot exceed 500 characters");
            _content = value;
        }
    }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ApplicationUser Author { get; set; } = null!;
    public ApplicationUser Recipient { get; set; } = null!;
}