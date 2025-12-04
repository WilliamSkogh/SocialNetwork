using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using SocialNetwork.Service;
using Xunit;

namespace Socialnetwork.Test;

public class MediaUploadServiceTests
{
    [Fact]
    public void MediaUploadService_ShouldExist()
    {
        // Arrange & Act
        var service = new MediaUploadService();

        // Assert
        service.Should().NotBeNull();
        service.Should().BeAssignableTo<IMediaUploadService>();
    }

    [Fact]
    public async Task UploadFileAsync_ShouldThrowException_WhenFileTypeIsInvalid()
    {
        // Arrange
        var service = new MediaUploadService();
        var mockFile = new Mock<IFormFile>();
        mockFile.Setup(f => f.ContentType).Returns("application/pdf");
        mockFile.Setup(f => f.Length).Returns(1024);

        // Act
        Func<Task> act = async () => await service.UploadFileAsync(mockFile.Object, "posts");

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Invalid file type*");
    }

    [Fact]
    public async Task UploadFileAsync_ShouldThrowException_WhenImageSizeExceeds10MB()
    {
        // Arrange
        var service = new MediaUploadService();
        var mockFile = new Mock<IFormFile>();
        mockFile.Setup(f => f.ContentType).Returns("image/jpeg");
        mockFile.Setup(f => f.Length).Returns(11 * 1024 * 1024); // 11 MB

        // Act
        Func<Task> act = async () => await service.UploadFileAsync(mockFile.Object, "posts");

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*must not exceed*10*MB*");
    }
}
