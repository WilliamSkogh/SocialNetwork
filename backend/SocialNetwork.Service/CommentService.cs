using SocialNetwork.Entityframework;
using SocialNetwork.Entity;

namespace SocialNetwork.Service;

public class CommentService : ICommentService
{
    private readonly ApplicationDbContext _context;

    public CommentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AddCommentAsync(int postId, string userId, string text)
    {
        var comment = new Comment
        {
            PostId = postId,
            UserId = userId,
            Text = text
        };

        _context.Set<Comment>().Add(comment);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveCommentAsync(int commentId)
    {
        var comment = await _context.Set<Comment>().FindAsync(commentId);
        
        if (comment == null)
        {
            return false;
        }

        _context.Set<Comment>().Remove(comment);
        await _context.SaveChangesAsync();
        return true;
    }
}
