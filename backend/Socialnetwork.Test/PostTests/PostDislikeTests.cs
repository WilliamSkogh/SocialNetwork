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
}
