using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;
using System.Security.Claims;

namespace SocialNetwork.Api.Endpoints.Follows;

public class Follow : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users/{targetUserId}");

        group.MapPost("/follow", async (string targetUserId, ClaimsPrincipal user, FollowService followService) =>
        {
            var currentUserId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == null)
            {
                return Results.Unauthorized();
            }
            try
            {
                await followService.FollowUserAsync(currentUserId, targetUserId);
                return Results.Ok(new { Message = "You are now following the user." });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
            .WithTags("Follows")
            .RequireAuthorization();
    }
}
