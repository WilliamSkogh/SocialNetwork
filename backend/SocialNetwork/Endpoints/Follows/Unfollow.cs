using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;
using System.Security.Claims;

namespace SocialNetwork.Api.Endpoints.Follows;

public class Unfollow : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users/{targetUserId}");
        group.MapDelete("/unfollow", async (string targetUserId, ClaimsPrincipal user, FollowService followService) =>
        {
            var currentUserId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (currentUserId == null) return Results.Unauthorized();
            
            try
            {
                await followService.UnfollowUserAsync(currentUserId, targetUserId);
                return Results.Ok(new { Message = "You have unfollowed the user." });
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
