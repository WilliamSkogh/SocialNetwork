using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;

namespace SocialNetwork.Endpoints;

public class DislikeEndpoints : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/posts/{postId}/dislikes")
            .WithTags("Dislikes");

        group.MapPost("", AddDislike)
            .RequireAuthorization();

        group.MapDelete("", RemoveDislike)
            .RequireAuthorization();
    }

    private static async Task<IResult> AddDislike(int postId, IDislikeService dislikeService, HttpContext httpContext)
    {
        var userId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        var result = await dislikeService.AddDislikeAsync(postId, userId);
        
        if (!result)
        {
            return Results.BadRequest("Already disliked this post");
        }

        return Results.Ok();
    }

    private static async Task<IResult> RemoveDislike(int postId, IDislikeService dislikeService, HttpContext httpContext)
    {
        var userId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        var result = await dislikeService.RemoveDislikeAsync(postId, userId);
        
        if (!result)
        {
            return Results.NotFound("Dislike not found");
        }

        return Results.Ok();
    }
}
