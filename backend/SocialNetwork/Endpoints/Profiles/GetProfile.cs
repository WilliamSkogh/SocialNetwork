using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;

namespace SocialNetwork.Api.Endpoints.Profiles;

public class GetProfile : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("api/users/{username}", async (string username, IProfileService profileService) =>
        {
            var profile = await profileService.GetUserProfileAsync(username);

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
