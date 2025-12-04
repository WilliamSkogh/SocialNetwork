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
}
