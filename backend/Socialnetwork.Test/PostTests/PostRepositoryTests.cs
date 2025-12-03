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

    [Fact]
    public async Task GetByIdAsync_WithExistingId_ReturnsPost()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var repository = new PostRepository(context);
        var post = new Post { AuthorId = "user1", RecipientId = "user2", Content = "Test" };
        await repository.CreateAsync(post);

        // Act
        var result = await repository.GetByIdAsync(post.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(post.Id);
        result.Content.Should().Be("Test");
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllPostsOrderedByNewest()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var repository = new PostRepository(context);
        
        var baseTime = DateTime.UtcNow;
        var post1 = new Post { AuthorId = "user1", RecipientId = "user2", Content = "First", CreatedAt = baseTime };
        var post2 = new Post { AuthorId = "user2", RecipientId = "user1", Content = "Second", CreatedAt = baseTime.AddSeconds(1) };
        var post3 = new Post { AuthorId = "user1", RecipientId = "user2", Content = "Third", CreatedAt = baseTime.AddSeconds(2) };
        
        await repository.CreateAsync(post1);
        await repository.CreateAsync(post2);
        await repository.CreateAsync(post3);

        // Act
        var result = await repository.GetAllAsync();
        var posts = result.ToList();

        // Assert
        posts.Should().HaveCount(3);
        posts[0].Content.Should().Be("Third");
        posts[1].Content.Should().Be("Second");
        posts[2].Content.Should().Be("First");
    }

    [Fact]
    public async Task UpdateAsync_WithExistingPost_UpdatesContent()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var repository = new PostRepository(context);
        var post = new Post { AuthorId = "user1", RecipientId = "user2", Content = "Original" };
        await repository.CreateAsync(post);

        // Act
        post.Content = "Updated";
        var result = await repository.UpdateAsync(post);

        // Assert
        result.Should().NotBeNull();
        result!.Content.Should().Be("Updated");
    }

    [Fact]
    public async Task DeleteAsync_WithExistingPost_ReturnsTrue()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var repository = new PostRepository(context);
        var post = new Post { AuthorId = "user1", RecipientId = "user2", Content = "Test" };
        await repository.CreateAsync(post);

        // Act
        var result = await repository.DeleteAsync(post.Id);

        // Assert
        result.Should().BeTrue();
        var deletedPost = await context.Posts.FindAsync(post.Id);
        deletedPost.Should().BeNull();
    }
}
