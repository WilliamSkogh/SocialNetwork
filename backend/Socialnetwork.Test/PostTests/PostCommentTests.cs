using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
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
}
