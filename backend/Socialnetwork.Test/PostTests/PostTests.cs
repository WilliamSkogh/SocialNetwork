using FluentAssertions;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using SocialNetwork.Service;
using Microsoft.EntityFrameworkCore;
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
    public async Task Post_Content_CannotBeEmpty()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;

        using var context = new ApplicationDbContext(options);
        var repository = new SocialNetwork.Repository.Posts.PostRepository(context);
        var service = new PostService(repository, context);

        var post = new Post
        {
            AuthorId = "William",
            RecipientId = "Pelle",
            Content = ""
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.CreatePostAsync(post)
        );
    }

    [Fact]
    public async Task Post_Content_CannotExceed500Characters()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;

        using var context = new ApplicationDbContext(options);
        var repository = new SocialNetwork.Repository.Posts.PostRepository(context);
        var service = new PostService(repository, context);

        var post = new Post
        {
            AuthorId = "William",
            RecipientId = "Pelle",
            Content = new string('x', 501)
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.CreatePostAsync(post)
        );
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
     [Fact]
    public void Post_Content_With1Character_ShouldSucceed()
    {
        // Arrange
        var content = "x";

        // Act
        var post = new Post
        {
            AuthorId = "William",
            RecipientId = "Pelle",
            Content = content
        };

        // Assert
        post.Content.Should().HaveLength(1);
    }
}