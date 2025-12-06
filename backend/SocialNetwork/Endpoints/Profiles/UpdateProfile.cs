using Microsoft.AspNetCore.Mvc;
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
            [FromForm] string? bio,
            IFormFile? profileImage,
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
                await profileService.UpdateUserProfileAsync(username, bio, profileImage);

                return Results.Ok(new { Message = "Profilen har uppdaterats!" });
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message);
            }
        })
        .WithTags("Profiles")
        .RequireAuthorization()
        .DisableAntiforgery();
    }
}
