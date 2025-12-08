using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;

namespace SocialNetwork.Repository.Posts;

public class PostRepository : IPostRepository
{
    private readonly ApplicationDbContext _context;

    public PostRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Post> CreateAsync(Post post)
    {
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        return post;
    }

    public async Task<Post?> GetByIdAsync(int id)
    {
        return await _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Likes)
            .Include(p => p.Dislikes)
            .Include(p => p.Comments)
                .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Post>> GetAllAsync()
    {
        return await _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Likes)
            .Include(p => p.Dislikes)
            .Include(p => p.Comments)
                .ThenInclude(c => c.User)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Post>> GetFeedPostsAsync()
    {
        return await _context.Posts
            .Where(p => p.RecipientId == null)
            .Include(p => p.Author)
            .Include(p => p.Likes)
            .Include(p => p.Dislikes)
            .Include(p => p.Comments)
                .ThenInclude(c => c.User)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Post>> GetUserProfilePostsAsync(string userId)
    {
        return await _context.Posts
            .Where(p => p.RecipientId == userId || p.AuthorId == userId)
            .Include(p => p.Author)
            .Include(p => p.Recipient)
            .Include(p => p.Likes)
            .Include(p => p.Dislikes)
            .Include(p => p.Comments)
                .ThenInclude(c => c.User)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Post?> UpdateAsync(Post post)
    {
        var existingPost = await _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Likes)
            .Include(p => p.Dislikes)
            .Include(p => p.Comments)
                .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(p => p.Id == post.Id);
            
        if (existingPost == null)
            return null;

        existingPost.Content = post.Content;
        await _context.SaveChangesAsync();
        return existingPost;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null)
            return false;

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return true;
    }
}
