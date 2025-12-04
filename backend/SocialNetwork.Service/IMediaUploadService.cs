using Microsoft.AspNetCore.Http;

namespace SocialNetwork.Service;

public interface IMediaUploadService
{
    Task<string> UploadFileAsync(IFormFile file, string destination);
}
