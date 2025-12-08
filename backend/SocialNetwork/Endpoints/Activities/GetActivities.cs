using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;
using System.Security.Claims;

namespace SocialNetwork.Api.Endpoints.Activities;

public class GetActivities : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/activities", async (ClaimsPrincipal user, IActivityService activityService) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Results.Unauthorized();
            }

            var activities = await activityService.GetUserActivitiesAsync(userId);
            return Results.Ok(activities);
        })
        .WithTags("Activities")
        .RequireAuthorization();
    }
}
