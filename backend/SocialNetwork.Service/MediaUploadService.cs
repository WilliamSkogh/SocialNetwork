using Microsoft.AspNetCore.Http;

namespace SocialNetwork.Service;

public class MediaUploadService : IMediaUploadService
{
    private readonly string[] _allowedImageTypes = { "image/jpeg", "image/png", "image/gif", "image/webp" };
    private readonly string[] _allowedVideoTypes = { "video/mp4", "video/webm", "video/quicktime" };
    private const long MaxImageSize = 10 * 1024 * 1024; // 10 MB
    private const long MaxVideoSize = 50 * 1024 * 1024; // 50 MB

    public async Task<string> UploadFileAsync(IFormFile file, string destination)
    {
        ValidateFile(file);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        
        var uploadPath = Path.Combine("wwwroot", "uploads", destination);
        Directory.CreateDirectory(uploadPath);
        
        var filePath = Path.Combine(uploadPath, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
        
        return $"/uploads/{destination}/{fileName}";
    }

    private void ValidateFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is required");

        var isImage = _allowedImageTypes.Contains(file.ContentType);
        var isVideo = _allowedVideoTypes.Contains(file.ContentType);

        if (!isImage && !isVideo)
            throw new ArgumentException($"Invalid file type. Allowed types: {string.Join(", ", _allowedImageTypes.Concat(_allowedVideoTypes))}");

        if (isImage && file.Length > MaxImageSize)
            throw new ArgumentException($"Image file size must not exceed {MaxImageSize / 1024 / 1024} MB");

        if (isVideo && file.Length > MaxVideoSize)
            throw new ArgumentException($"Video file size must not exceed {MaxVideoSize / 1024 / 1024} MB");
    }
}
