using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using SocialNetwork.Repository.Posts;

namespace SocialNetwork.Service
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly ApplicationDbContext _db;

        public PostService(IPostRepository postRepository, ApplicationDbContext db)
        {
            _postRepository = postRepository;
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

            var recipientExists = await _db.Users.AnyAsync(u => u.Id == post.RecipientId);
            if (!recipientExists)
            {
                throw new ArgumentException("Recipient not found");
            }

            return await _postRepository.CreateAsync(post);
        }
    }
}
