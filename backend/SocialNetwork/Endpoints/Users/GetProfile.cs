using Microsoft.AspNetCore.Identity;
using SocialNetwork.Api.Abstractions;
using SocialNetwork.Entity;
using System.Security.Claims;

namespace SocialNetwork.Endpoints.Users;

public class GetProfile : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/profile", async (ClaimsPrincipal user, UserManager<ApplicationUser> userManager) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Results.Unauthorized();
            }

            var appUser = await userManager.FindByIdAsync(userId);

            if (appUser == null)
            {
                return Results.NotFound("Användaren hittades inte i databasen.");
            }

            return Results.Ok(new
            {
                Id = appUser.Id,
                Email = appUser.Email,
                Username = appUser.UserName
            });
        })
        .WithTags("Users")         
        .RequireAuthorization();   
    }
}