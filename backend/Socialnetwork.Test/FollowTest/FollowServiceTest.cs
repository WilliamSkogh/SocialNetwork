using FluentAssertions;
using Moq;
using Socialnetwork.Repository;
using SocialNetwork.Entity;
using SocialNetwork.Service;

namespace Socialnetwork.Test.FollowTest;

public class FollowServiceTests
{
    private readonly Mock<IFollowRepository> _mockRepo;
    private readonly FollowService _sut;

    public FollowServiceTests()
    {
        _mockRepo = new Mock<IFollowRepository>();
        _sut = new FollowService(_mockRepo.Object);
    }



[Fact]
public async Task FollowUser_Should_AddFollow_And_IncrementCounts_When_Not_Already_Following()
{
    // Arrange
    var followerId = "user-a";
    var followingId = "user-b";

    var followerUser = new ApplicationUser{Id = followerId, FollowingCount = 0};
    var followingUser = new ApplicationUser{Id = followingId, FollowerCount = 0};

    _mockRepo.Setup(r => r.GetUserByIdAsync(followerId)).ReturnsAsync(followerUser);
    _mockRepo.Setup(r => r.GetUserByIdAsync(followingId)).ReturnsAsync(followingUser);

    _mockRepo.Setup(r => r.IsFollowingAsync(followerId, followingId)).ReturnsAsync(false);
     // Act
     await _sut.FollowUserAsync(followerId, followingId);
     
    // Assert
    _mockRepo.Verify(r => r.AddFollowAsync(It.Is<Follow>(f => f.FollowerId == followerId && f.FollowingId == followingId)), Times.Once);

    
    followerUser.FollowingCount.Should().Be(1);
    followingUser.FollowerCount.Should().Be(1);

    _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Once);


    }
}


