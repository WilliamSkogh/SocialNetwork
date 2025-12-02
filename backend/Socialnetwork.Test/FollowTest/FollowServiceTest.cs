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
    [Fact]
    public async Task FollowUser_Should_ThrowException_When_User_Does_Not_Exist()
    {
        // Arrange
        var followerId = "user-a";
        var followingId = "ghost-user";

        _mockRepo.Setup(r => r.IsFollowingAsync(followerId, followingId)).ReturnsAsync(false);

        _mockRepo.Setup(r => r.GetUserByIdAsync(followingId)).ReturnsAsync(new ApplicationUser());

        _mockRepo.Setup(r => r.GetUserByIdAsync(followingId)).ReturnsAsync((ApplicationUser?)null);

        // Act
        // Assert
        var action = async () => await _sut.FollowUserAsync(followerId, followingId);

        await action.Should().ThrowAsync<Exception>().WithMessage("Invalid user ID.");
    }
    [Fact]

    public async Task FollowUser_Should_Not_Allow_Following_Self()
    {
        //Arrange
        var userId = "user-a";
        // Act
        var action = async () => await _sut.FollowUserAsync(userId, userId);
        // Assert
        await action.Should().ThrowAsync<Exception>().WithMessage("You cannot follow yourself.");
    }
    [Fact]

    public async Task UnfollowUser_Should_RemoveFollow_And_DecrementCounts_When_Following_Exists()
    {
        // Arrange
        var followerId = "user-a";
        var followingId = "user-b";

        var followerUser = new ApplicationUser { Id = followerId, FollowingCount = 1 };
        var followingUser = new ApplicationUser { Id = followingId, FollowerCount = 1 };

        var existingFollow = new Follow { FollowerId = followerId, FollowingId = followingId  };

        _mockRepo.Setup(r => r.GetUserByIdAsync(followerId)).ReturnsAsync(followerUser);
        _mockRepo.Setup(r => r.GetUserByIdAsync(followingId)).ReturnsAsync(followingUser);

        _mockRepo.Setup(r => r.GetFollowAsync(followerId, followingId)).ReturnsAsync(existingFollow);

        // Act
        await _sut.UnfollowUserAsync(followerId, followingId);

        // Assert
        _mockRepo.Verify(r => r.RemoveFollowAsync(existingFollow), Times.Once);
        followerUser.FollowingCount.Should().Be(0);
        followingUser.FollowerCount.Should().Be(0);
        _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}


