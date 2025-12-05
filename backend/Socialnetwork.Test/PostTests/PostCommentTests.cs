using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using SocialNetwork.Service;
using Socialnetwork.Entityframework;

namespace Socialnetwork.Test.PostTests;

public class PostCommentTests
{
    [Fact]
    public void Post_ShouldHaveCommentsCollection()
    {
        // Arrange
        var post = new Post();

        // Act
        var comments = post.Comments;

        // Assert
        comments.Should().NotBeNull();
        comments.Should().BeEmpty();
    }

    [Fact]
    public async Task CommentService_ShouldAddCommentToPost()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "AddCommentTestDb")
            .Options;
        using var context = new ApplicationDbContext(options);
        var service = new CommentService(context);

        var postId = 1;
        var userId = "user1";
        var text = "Great post!";

        // Act
        var result = await service.AddCommentAsync(postId, userId, text);

        // Assert
        result.Should().BeTrue();
        var comments = context.Set<Comment>().Where(c => c.PostId == postId && c.UserId == userId);
        comments.Count().Should().Be(1);
        comments.First().Text.Should().Be(text);
    }

    [Fact]
    public async Task CommentService_ShouldRemoveComment()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "RemoveCommentTestDb")
            .Options;
        using var context = new ApplicationDbContext(options);
        var service = new CommentService(context);

        var postId = 1;
        var userId = "user1";
        var text = "Test comment";

        var addResult = await service.AddCommentAsync(postId, userId, text);
        var comment = context.Set<Comment>().First(c => c.PostId == postId && c.UserId == userId);
        var commentId = comment.Id;

        // Act
        var result = await service.RemoveCommentAsync(commentId);

        // Assert
        result.Should().BeTrue();
        var comments = context.Set<Comment>().Where(c => c.Id == commentId);
        comments.Count().Should().Be(0);
    }
}
