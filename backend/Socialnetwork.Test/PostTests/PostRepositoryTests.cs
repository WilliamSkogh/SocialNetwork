using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using SocialNetwork.Repository.Posts;
using Xunit;

namespace Socialnetwork.Test.PostTests;

public class PostRepositoryTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_ShouldAddPostToDatabase()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var repository = new PostRepository(context);
        var post = new Post
        {
            AuthorId = "user1",
            RecipientId = "user2",
            Content = "Test post"
        };

        // Act
        var result = await repository.CreateAsync(post);

        // Assert
        result.Id.Should().BeGreaterThan(0);
        result.Content.Should().Be("Test post");
        
        var savedPost = await context.Posts.FindAsync(result.Id);
        savedPost.Should().NotBeNull();
        savedPost!.Content.Should().Be("Test post");
    }
}
