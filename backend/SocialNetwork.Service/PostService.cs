using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using SocialNetwork.Repository.Posts;
using Socialnetwork.Repository;

namespace SocialNetwork.Service
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IFollowRepository _followRepository;
        private readonly ApplicationDbContext _db;

        public PostService(IPostRepository postRepository, IFollowRepository followRepository, ApplicationDbContext db)
        {
            _postRepository = postRepository;
            _followRepository = followRepository;
            _db = db;
        }

        public async Task<Post> CreatePostAsync(Post post)
        {
            if (string.IsNullOrWhiteSpace(post.Content))
                throw new ArgumentException("Content cannot be empty or whitespace.");
            
            if (post.Content.Length > 500)
                throw new ArgumentException("Content cannot exceed 500 characters.");

            var authorExists = await _db.Users.AnyAsync(u => u.Id == post.AuthorId);
            if (!authorExists)
            {
                throw new ArgumentException("Author not found");
            }

            if (!string.IsNullOrEmpty(post.RecipientId))
            {
                var recipientExists = await _db.Users.AnyAsync(u => u.Id == post.RecipientId);
                if (!recipientExists)
                {
                    throw new ArgumentException("Recipient not found");
                }
            }

            return await _postRepository.CreateAsync(post);
        }

        public async Task<Post?> GetPostByIdAsync(int id)
        {
            return await _postRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Post>> GetAllPostsAsync()
        {
            return await _postRepository.GetFeedPostsAsync();
        }

        public async Task<IEnumerable<Post>> GetFollowingPostsAsync(string userId)
        {
            var followingIds = await _followRepository.GetFollowingIdsAsync(userId);
            
            var posts = await _db.Posts
                .Where(p => p.RecipientId == null)
                .Include(p => p.Author)
                .Include(p => p.Likes)
                .Include(p => p.Dislikes)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .Where(p => followingIds.Contains(p.AuthorId))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return posts;
        }

        public async Task<IEnumerable<Post>> GetUserProfilePostsAsync(string userId)
        {
            return await _postRepository.GetUserProfilePostsAsync(userId);
        }

        public async Task<Post?> UpdatePostAsync(int id, string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Content cannot be empty or whitespace.");
            
            if (content.Length > 500)
                throw new ArgumentException("Content cannot exceed 500 characters.");

            var post = await _postRepository.GetByIdAsync(id);
            if (post == null)
                return null;

            post.Content = content;
            return await _postRepository.UpdateAsync(post);
        }

        public async Task<bool> DeletePostAsync(int id)
        {
            return await _postRepository.DeleteAsync(id);
        }
    }
}
