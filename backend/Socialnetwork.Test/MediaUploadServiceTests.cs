using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using SocialNetwork.Service;
using Xunit;

namespace Socialnetwork.Test;

public class MediaUploadServiceTests
{
    [Fact]
    public async Task UploadFileAsync_ShouldReturnFileUrl_WhenFileIsValid()
    {
        // Arrange
        var service = new MediaUploadService();
        var mockFile = new Mock<IFormFile>();
        var content = "fake image content";
        var fileName = "test.jpg";
        var ms = new MemoryStream();
        var writer = new StreamWriter(ms);
        writer.Write(content);
        writer.Flush();
        ms.Position = 0;

        mockFile.Setup(f => f.FileName).Returns(fileName);
        mockFile.Setup(f => f.Length).Returns(ms.Length);
        mockFile.Setup(f => f.ContentType).Returns("image/jpeg");
        mockFile.Setup(f => f.OpenReadStream()).Returns(ms);
        mockFile.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .Returns((Stream stream, CancellationToken token) => ms.CopyToAsync(stream, token));

        // Act
        var result = await service.UploadFileAsync(mockFile.Object, "posts");

        // Assert
        result.Should().NotBeNullOrEmpty();
        result.Should().StartWith("/uploads/posts/");
        result.Should().EndWith(".jpg");
    }
}
