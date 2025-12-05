using FluentAssertions;
using SocialNetwork.Entity;
using SocialNetwork.Service;
using SocialNetwork.Entityframework;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Socialnetwork.Test.PostTests;

public class PostLikeTests
{
    [Fact]
    public void Post_ShouldHaveLikesCollection()
    {
        // Arrange & Act
        var post = new Post();
        
        // Assert
        post.Likes.Should().NotBeNull();
        post.Likes.Should().BeEmpty();
    }

    [Fact]
    public void Post_ShouldAllowAddingLike()
    {
        // Arrange
        var post = new Post { Id = 1 };
        var like = new Like { PostId = 1, UserId = "user123" };
        
        // Act
        post.Likes.Add(like);
        
        // Assert
        post.Likes.Should().HaveCount(1);
        post.Likes.First().UserId.Should().Be("user123");
    }

    [Fact]
    public async Task LikeService_ShouldAddLikeToPost()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "LikeTestDb")
            .Options;

        using var context = new ApplicationDbContext(options);
        var likeService = new LikeService(context);
        var postId = 1;
        var userId = "user123";
        
        // Act
        var result = await likeService.AddLikeAsync(postId, userId);
        
        // Assert
        result.Should().BeTrue();
        var like = await context.Set<Like>().FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);
        like.Should().NotBeNull();
    }
}
