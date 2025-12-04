using FluentAssertions;
using SocialNetwork.Api.DTOs;
using SocialNetwork.Entity;
using Xunit;

namespace Socialnetwork.Test.PostTests;

public class PostImageTests
{
    [Fact]
    public void Post_ShouldStoreImageUrl_WhenImageIsAttached()
    {
        // Arrange
        var imageUrl = "/uploads/posts/test-image.jpg";
        
        // Act
        var post = new Post
        {
            Id = 1,
            AuthorId = "user1",
            Content = "Post with image",
            ImageUrl = imageUrl  
        };

        // Assert
        post.ImageUrl.Should().Be(imageUrl);
    }

    [Fact]
    public void PostRequest_ShouldIncludeImageUrl_WhenCreatedWithImage()
    {
        // Arrange
        var imageUrl = "/uploads/posts/test-image.jpg";
        
        // Act
        var request = new PostRequest(
            AuthorId: "user1",
            RecipientId: null,
            Content: "Post with image",
            ImageUrl: imageUrl
        );

        // Assert
        request.ImageUrl.Should().Be(imageUrl);
    }

    [Fact]
    public void PostResponse_ShouldIncludeImageUrl_WhenPostHasImage()
    {
        // Arrange
        var imageUrl = "/uploads/posts/test-image.jpg";
        
        // Act
        var response = new PostResponse(
            Id: 1,
            AuthorId: "user1",
            RecipientId: null,
            Content: "Post with image",
            ImageUrl: imageUrl,
            CreatedAt: DateTime.UtcNow
        );

        // Assert
        response.ImageUrl.Should().Be(imageUrl);
    }
}
