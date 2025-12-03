using System;
using System.Threading.Tasks;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;

namespace SocialNetwork.Service
{
    public class PostService : IPostService
    {
        private readonly ApplicationDbContext _db;

        public PostService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<Post> CreatePostAsync(Post post)
        {
            if (string.IsNullOrWhiteSpace(post.Content))
                throw new ArgumentException("Content cannot be empty");
            
            if (post.Content.Length > 500)
                throw new ArgumentException("Content cannot exceed 500 characters");

            _db.Posts.Add(post);
            await _db.SaveChangesAsync();
            return post;
        }
    }
}
