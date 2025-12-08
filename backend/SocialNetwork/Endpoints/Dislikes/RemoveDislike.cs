using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;

namespace SocialNetwork.Endpoints.Dislikes;

public class RemoveDislike : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("api/posts/{postId}/dislikes", HandleAsync)
            .WithTags("Dislikes")
            .RequireAuthorization();
    }

    private static async Task<IResult> HandleAsync(int postId, IDislikeService dislikeService, HttpContext httpContext)
    {
        var userId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        var result = await dislikeService.RemoveDislikeAsync(postId, userId);
        
        if (!result)
        {
            return Results.BadRequest("Dislike not found");
        }

        return Results.Ok();
    }
}
