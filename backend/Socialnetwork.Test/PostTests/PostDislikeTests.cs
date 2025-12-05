using FluentAssertions;
using SocialNetwork.Entity;
using SocialNetwork.Service;
using SocialNetwork.Entityframework;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Socialnetwork.Test.PostTests;

public class PostDislikeTests
{
    [Fact]
    public void Post_ShouldHaveDislikesCollection()
    {
        // Arrange & Act
        var post = new Post();
        
        // Assert
        post.Dislikes.Should().NotBeNull();
        post.Dislikes.Should().BeEmpty();
    }

    [Fact]
    public async Task DislikeService_ShouldAddDislikeToPost()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "DislikeTestDb")
            .Options;

        using var context = new ApplicationDbContext(options);
        var dislikeService = new DislikeService(context);
        var postId = 1;
        var userId = "user123";
        
        // Act
        var result = await dislikeService.AddDislikeAsync(postId, userId);
        
        // Assert
        result.Should().BeTrue();
        var dislike = await context.Set<Dislike>().FirstOrDefaultAsync(d => d.PostId == postId && d.UserId == userId);
        dislike.Should().NotBeNull();
    }

    [Fact]
    public async Task DislikeService_ShouldNotAddDuplicateDislike()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "DuplicateDislikeTestDb")
            .Options;

        using var context = new ApplicationDbContext(options);
        var dislikeService = new DislikeService(context);
        var postId = 1;
        var userId = "user123";
        
        await dislikeService.AddDislikeAsync(postId, userId);
        
        // Act
        var result = await dislikeService.AddDislikeAsync(postId, userId);
        
        // Assert
        result.Should().BeFalse();
        var dislikeCount = await context.Set<Dislike>().CountAsync(d => d.PostId == postId && d.UserId == userId);
        dislikeCount.Should().Be(1);
    }

    [Fact]
    public async Task DislikeService_ShouldRemoveDislike()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "RemoveDislikeTestDb")
            .Options;
        using var context = new ApplicationDbContext(options);
        var service = new DislikeService(context);

        var postId = 1;
        var userId = "user1";

        await service.AddDislikeAsync(postId, userId);

        // Act
        var result = await service.RemoveDislikeAsync(postId, userId);

        // Assert
        result.Should().BeTrue();
        var dislikes = context.Set<Dislike>().Where(d => d.PostId == postId && d.UserId == userId);
        dislikes.Count().Should().Be(0);
    }
}
