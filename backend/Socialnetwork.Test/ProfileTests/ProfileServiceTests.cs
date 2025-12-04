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
        var result = await _sut.GetUserProfileAsync(testUsername);

        //Assert
        result.Should().NotBeNull();
        result!.UserName.Should().Be(testUsername);
        result.Bio.Should().Be("This is a test bio");
        result.ProfileImageUrl.Should().Be("profile.jpg");
        result.FollowerCount.Should().Be(10);
        result.FollowingCount.Should().Be(5);

        _mockRepo.Verify(r => r.GetUserByUsernameAsync(testUsername), Times.Once);
    }

    [Fact]
    public async Task GetProfileAsync_Should_ReturnNull_When_User_Does_Not_Exist()
    {
        // Arrange
        var username = "nonexistentuser";

        _mockRepo.Setup(r => r.GetUserByUsernameAsync(username))
                 .ReturnsAsync((ApplicationUser?)null);
        // Act
        var result = await _sut.GetUserProfileAsync(username);
        // Assert
        result.Should().BeNull();
        _mockRepo.Verify(r => r.GetUserByUsernameAsync(username), Times.Once);
    }
    [Fact]
    public async Task UpdateProfile_Should_Update_Bio_And_Image_When_User_Exists()
    {
        // Arrange
        var username = "testuser";
        var oldUser = new ApplicationUser
        {
            UserName = username,
            Bio = "Old bio",
            ProfileImageUrl = "oldimage.jpg"
        };

        var newBio = "New bio";
        var newImageUrl = "newimage.jpg";

        _mockRepo.Setup(r => r.GetUserByUsernameAsync(username))
                 .ReturnsAsync(oldUser);
        // Act
        await _sut.UpdateUserProfileAsync(username, newBio, newImageUrl);

        // Assert
        _mockRepo.Verify(r => r.UpdateUserAsync(It.Is<ApplicationUser>(u =>
            u.UserName == username &&
            u.Bio == newBio &&
            u.ProfileImageUrl == newImageUrl
        )), Times.Once);
    }
    [Fact]
    public async Task UpdateUserProfileAsync_Should_Throw_When_Bio_Is_Too_Long()
    {
        // Arrange
        var username = "AnnoyingUser";
        var tooLongBio = new string('a', 501);
        
        _mockRepo.Setup(r => r.GetUserByUsernameAsync(username))
                 .ReturnsAsync(new ApplicationUser { UserName = username });
        // Act
        var action = async () => await _sut.UpdateUserProfileAsync(username, tooLongBio, "someimage.jpg");

        // Assert
        await action.Should().ThrowAsync<ArgumentException>()
            .WithMessage("Bio cannot exceed 500 characters.*");

        _mockRepo.Verify(r => r.UpdateUserAsync(It.IsAny<ApplicationUser>()), Times.Never);
    }
    [Fact]

    public async Task UpdateProfileAsync_Should_Clear_Bio_And_Image_When_Strings_Are_Empty()
    {
        // Arrange

        var username = "testuser";
        var oldUser = new ApplicationUser
        {
            UserName = username,
            Bio = "Old text that should be removed",
            ProfileImageUrl = "oldimage-super-ugly.jpg"
        };
        var newBio = string.Empty;
        var newImageUrl = string.Empty;
        _mockRepo.Setup(r => r.GetUserByUsernameAsync(username))
                 .ReturnsAsync(oldUser);
        // Act
        await _sut.UpdateUserProfileAsync(username, "", "");
        // Assert
        _mockRepo.Verify(r => r.UpdateUserAsync(It.Is<ApplicationUser>(u =>
            u.UserName == username &&
            u.Bio == "" &&
            u.ProfileImageUrl == ""
        )), Times.Once);
    }
}
