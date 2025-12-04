namespace SocialNetwork.Api.DTOs
{
    public class UserProfileDto
    {
        public string UserName { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? ProfileImageUrl { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }

    }
}
