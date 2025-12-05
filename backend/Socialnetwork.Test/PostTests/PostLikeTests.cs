using FluentAssertions;
using SocialNetwork.Entity;
using Xunit;

namespace Socialnetwork.Test.PostTests;

public class PostLikeTests
{
    [Fact]
    public void Post_ShouldHaveLikesCollection()
    {
        var post = new Post();
        
        post.Likes.Should().NotBeNull();
        post.Likes.Should().BeEmpty();
    }
}
