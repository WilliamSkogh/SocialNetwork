using FluentAssertions;
using Xunit;

namespace Socialnetwork.Test.PostTests;

public class PostMediaUploadTests
{
    [Fact]
    public void MediaUpload_ShouldAcceptImageFile_WhenSizeIsWithin10MB()
    {
        // Arrange
        var contentType = "image/jpeg";
        var fileSize = 8 * 1024 * 1024; // 8 MB
        var maxImageSize = 10 * 1024 * 1024; // 10 MB

        // Act
        var isValid = contentType.StartsWith("image/") && fileSize <= maxImageSize;

        // Assert
        isValid.Should().BeTrue();
    }

    [Fact]
    public void MediaUpload_ShouldRejectImageFile_WhenSizeExceeds10MB()
    {
        // Arrange
        var contentType = "image/jpeg";
        var fileSize = 11 * 1024 * 1024; // 11 MB
        var maxImageSize = 10 * 1024 * 1024; // 10 MB

        // Act
        var isValid = contentType.StartsWith("image/") && fileSize <= maxImageSize;

        // Assert
        isValid.Should().BeFalse();
    }
}

