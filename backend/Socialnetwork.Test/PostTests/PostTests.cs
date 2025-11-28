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
    
    [Fact]
    public void Post_Content_CannotBeEmpty()
    {
        // Arrange
        var authorId = "William";
        var recipientId = "Pelle";

        // Act
        Action act = () => new Post
        {
            AuthorId = authorId,
            RecipientId = recipientId,
            Content = ""
        };

        // Assert
        act.Should().Throw<ArgumentException>()
            .WithMessage("*Content cannot be empty*");
    }
    [Fact]
    public void Post_Content_CannotExceed500Characters()
    {
        // Arrange
        var longContent = new string('x', 501);

        // Act
        Action act = () => new Post
        {
            AuthorId = "William",
            RecipientId = "Pelle",
            Content = longContent
        };

        // Assert
        act.Should().Throw<ArgumentException>()
            .WithMessage("*Content cannot exceed 500 characters*");
    }

    [Fact]
    public void Post_Content_With500Characters_ShouldSucceed()
    {
        // Arrange
        var content = new string('x', 500);

        // Act
        var post = new Post
        {
            AuthorId = "William",
            RecipientId = "Pelle",
            Content = content
        };

        // Assert
        post.Content.Should().HaveLength(500);
    }
}