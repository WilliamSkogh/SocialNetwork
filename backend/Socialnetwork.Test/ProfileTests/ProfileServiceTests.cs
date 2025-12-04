using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using Socialnetwork.Repository.Profile;
using SocialNetwork.Entity;
using SocialNetwork.Service;

namespace Socialnetwork.Test.ProfileTests;

public class ProfileServiceTests
{
    private readonly Mock<IProfileRepository> _mockRepo;
    private readonly Mock<IMediaUploadService> _mockMediaService; 
    private readonly ProfileService _sut;

    public ProfileServiceTests()
    {
        _mockRepo = new Mock<IProfileRepository>();
        _mockMediaService = new Mock<IMediaUploadService>(); 

        _sut = new ProfileService(_mockRepo.Object, _mockMediaService.Object);
    }

    [Fact]
    public async Task GetProfileAsync_ShouldReturnCorrectDto_WhenUSerExists()
    {
        var username = "testuser";
        _mockRepo.Setup(r => r.GetUserByUsernameAsync(username))
                 .ReturnsAsync(new ApplicationUser { UserName = username, Bio = "Bio", ProfileImageUrl = "img.jpg" });

        var result = await _sut.GetUserProfileAsync(username);
        result.Should().NotBeNull();
    }

    [Fact]
    public async Task GetProfileAsync_Should_ReturnNull_When_User_Does_Not_Exist()
    {
        _mockRepo.Setup(r => r.GetUserByUsernameAsync("ghost")).ReturnsAsync((ApplicationUser?)null);
        var result = await _sut.GetUserProfileAsync("ghost");
        result.Should().BeNull();
    }


    [Fact]
    public async Task UpdateProfile_Should_Update_Bio_And_Upload_Image_When_File_Is_Provided()
    {
        // Arrange
        var username = "testuser";
        var oldUser = new ApplicationUser { UserName = username, Bio = "Old bio", ProfileImageUrl = "old.jpg" };
        var newBio = "New bio";

        var mockFile = new Mock<IFormFile>();
        var fakeUrl = "/uploads/profiles/new-random-image.jpg";

        _mockRepo.Setup(r => r.GetUserByUsernameAsync(username)).ReturnsAsync(oldUser);

        _mockMediaService.Setup(m => m.UploadFileAsync(It.IsAny<IFormFile>(), "profiles"))
                         .ReturnsAsync(fakeUrl);

        // Act
        await _sut.UpdateUserProfileAsync(username, newBio, mockFile.Object);

        // Assert
        _mockRepo.Verify(r => r.UpdateUserAsync(It.Is<ApplicationUser>(u =>
            u.UserName == username &&
            u.Bio == newBio &&
            u.ProfileImageUrl == fakeUrl
        )), Times.Once);
    }

    [Fact]
    public async Task UpdateUserProfileAsync_Should_Throw_When_Bio_Is_Too_Long()
    {
        // Arrange
        var username = "AnnoyingUser";
        var tooLongBio = new string('a', 501);

        // Act
        var action = async () => await _sut.UpdateUserProfileAsync(username, tooLongBio, null);

        // Assert
        await action.Should().ThrowAsync<ArgumentException>()
            .WithMessage("Bio cannot exceed 500 characters.*");
    }

    [Fact]
    public async Task UpdateProfileAsync_Should_Keep_Old_Image_When_No_New_File_Is_Provided()
    {
        // Arrange
        var username = "testuser";
        var oldUser = new ApplicationUser
        {
            UserName = username,
            ProfileImageUrl = "old-image.jpg"
        };

        _mockRepo.Setup(r => r.GetUserByUsernameAsync(username)).ReturnsAsync(oldUser);

        // Act
        await _sut.UpdateUserProfileAsync(username, "New Bio", null);

        // Assert
        _mockRepo.Verify(r => r.UpdateUserAsync(It.Is<ApplicationUser>(u =>
            u.ProfileImageUrl == "old-image.jpg"
        )), Times.Once);

        _mockMediaService.Verify(m => m.UploadFileAsync(It.IsAny<IFormFile>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task UpdateUserProfileAsync_Should_Propagate_Exception_From_MediaService_When_File_Is_Invalid()
    {

        // ARRANGE
        var username = "testuser";
        var mockFile = new Mock<IFormFile>();

        _mockRepo.Setup(r => r.GetUserByUsernameAsync(username))
                 .ReturnsAsync(new ApplicationUser { UserName = username });

        _mockMediaService.Setup(m => m.UploadFileAsync(It.IsAny<IFormFile>(), "profiles"))
                         .ThrowsAsync(new ArgumentException("Invalid file type"));

        // ACT
        var action = async () => await _sut.UpdateUserProfileAsync(username, "Bio", mockFile.Object);

        // ASSERT
        await action.Should().ThrowAsync<ArgumentException>()
            .WithMessage("Invalid file type");
    }
}