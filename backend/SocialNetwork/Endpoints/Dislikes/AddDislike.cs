using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;

namespace SocialNetwork.Endpoints.Dislikes;

public class AddDislike : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("api/posts/{postId}/dislikes", HandleAsync)
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

        var result = await dislikeService.AddDislikeAsync(postId, userId);
        
        if (!result)
        {
            return Results.BadRequest("Already disliked this post");
        }

        return Results.Ok();
    }
}
