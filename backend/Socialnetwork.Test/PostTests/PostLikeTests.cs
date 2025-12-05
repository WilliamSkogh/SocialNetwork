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

    [Fact]
    public void Post_ShouldAllowAddingLike()
    {
        var post = new Post { Id = 1 };
        var like = new Like { PostId = 1, UserId = "user123" };
        
        post.Likes.Add(like);
        
        post.Likes.Should().HaveCount(1);
        post.Likes.First().UserId.Should().Be("user123");
    }
}
