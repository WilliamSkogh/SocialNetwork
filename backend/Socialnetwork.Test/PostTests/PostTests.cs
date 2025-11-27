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
}