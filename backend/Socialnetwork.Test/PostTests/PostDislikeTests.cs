using FluentAssertions;
using SocialNetwork.Entity;
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
}
