namespace SocialNetwork.Api.DTOs;

public class UpdateProfileDto
{
    public string? Bio { get; set; }
    public IFormFile? ProfileImage { get; set; }
}