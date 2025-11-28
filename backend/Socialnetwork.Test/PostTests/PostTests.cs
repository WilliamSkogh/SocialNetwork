using FluentAssertions;
using SocialNetwork.Entity;
using Xunit;

namespace Socialnetwork.Test.PostTests;

public class PostTests
{
    [Fact]
    public void Post_ShouldBeCreated_WithAuthorAndRecipient()
    {
        // Arrange
        var authorId = "William";
        var recipientId = "Pelle";
        var content = "Hello Pelle where is Amar?";

        // Act
        var post = new Post
        {
            AuthorId = authorId,
            RecipientId = recipientId,
            Content = content
        };

        // Assert
        post.AuthorId.Should().Be(authorId);
        post.RecipientId.Should().Be(recipientId);
        post.Content.Should().Be(content);
    }

    [Fact]
    public void Post_CreatedAt_ShouldBeSetAutomatically()
    {
        // Arrange
        var beforeCreation = DateTime.UtcNow;

        // Act
        var post = new Post
        {
            AuthorId = "William",
            RecipientId = "Pelle",
            Content = "Test"
        };
        var afterCreation = DateTime.UtcNow;

        // Assert
        post.CreatedAt.Should().BeOnOrAfter(beforeCreation);
        post.CreatedAt.Should().BeOnOrBefore(afterCreation);
    }

}