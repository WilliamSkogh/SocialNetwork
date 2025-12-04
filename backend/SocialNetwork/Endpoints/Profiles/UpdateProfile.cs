using SocialNetwork.Api.Abstractions;
using SocialNetwork.Api.DTOs;
using SocialNetwork.Service;
using System.Security.Claims;

namespace SocialNetwork.Api.Endpoints.Profiles;

public class UpdateProfile : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/users/{username}", async (
            string username,
            UpdateProfileRequest request,
            ClaimsPrincipal user,
            IProfileService profileService) =>
        {

            var loggedInUserName = user.FindFirstValue(ClaimTypes.Name);

            if (loggedInUserName is null || !loggedInUserName.Equals(username, StringComparison.OrdinalIgnoreCase))
            {
                return Results.Forbid(); 
            }
            try
            {
                await profileService.UpdateUserProfileAsync(username, request.Bio, request.ImageUrl);
                return Results.Ok(new { Message = "Profilen har uppdaterats!" });
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return Results.Problem("Ett oväntat fel inträffade." +ex);
            }
        })
        .WithTags("Profiles")
        .RequireAuthorization();
    }
}
