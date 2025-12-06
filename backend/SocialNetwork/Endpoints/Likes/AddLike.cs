using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;

namespace SocialNetwork.Endpoints.Likes;

public class AddLike : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("api/posts/{postId}/likes", HandleAsync)
            .WithTags("Likes")
            .RequireAuthorization();
    }

    private static async Task<IResult> HandleAsync(int postId, ILikeService likeService, HttpContext httpContext)
    {
        var userId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        var result = await likeService.AddLikeAsync(postId, userId);
        
        if (!result)
        {
            return Results.BadRequest("Already liked this post");
        }

        return Results.Ok();
    }
}
