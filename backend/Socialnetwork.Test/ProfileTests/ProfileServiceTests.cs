using FluentAssertions;
using Moq;
using Socialnetwork.Repository.Profile;
using SocialNetwork.Entity;
using SocialNetwork.Service;

namespace Socialnetwork.Test.ProfileTests;

public class ProfileServiceTests
{
    private readonly Mock<IProfileRepository> _mockRepo;
    private readonly ProfileService _sut;
    public ProfileServiceTests()
    {
        _mockRepo = new Mock<IProfileRepository>();
        _sut = new ProfileService(_mockRepo.Object);
    }


    [Fact]

    public async Task GetProfileAsync_ShouldReturnCorrectDto_WhenUSerExists()
    {
        // Arrange
        string testUsername = "testuser";

        var mockUser = new ApplicationUser
        {
            UserName = testUsername,
            Bio = "This is a test bio",
            ProfileImageUrl = "profile.jpg",
            FollowerCount = 10,
            FollowingCount = 5
        };

        _mockRepo.Setup(r => r.GetUserByUsernameAsync(testUsername))
                 .ReturnsAsync(mockUser);
        //Act
        var result = await _sut.GetProfileAsync(testUsername);

        //Assert
        result.Should().NotBeNull();
        result!.UserName.Should().Be(testUsername);
        result.Bio.Should().Be("This is a test bio");
        result.ProfileImageUrl.Should().Be("profile.jpg");
        result.FollowerCount.Should().Be(10);
        result.FollowingCount.Should().Be(5);

        _mockRepo.Verify(r => r.GetUserByUsernameAsync(testUsername), Times.Once);
    }
}
