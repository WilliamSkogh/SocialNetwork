namespace SocialNetwork.Service.DTOs
{
    public class UserSearchResultDto
    {
        public string Id { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? ProfileImageUrl { get; set; }
    }
}
