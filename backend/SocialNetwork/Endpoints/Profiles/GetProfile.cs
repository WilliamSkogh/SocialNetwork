using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;
using System.Security.Claims;

namespace SocialNetwork.Api.Endpoints.Profiles;

public class GetProfile : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("api/users/{username}", async (string username, IProfileService profileService, ClaimsPrincipal user) =>
        {
            var currentUserId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            var profile = await profileService.GetUserProfileAsync(username, currentUserId);

            if (profile == null)
            {
                return Results.NotFound(new { Message = "Användaren hittades inte." });
            }
            return Results.Ok(profile);
        })
            .WithTags("Profiles")
            .RequireAuthorization();
    }
}
