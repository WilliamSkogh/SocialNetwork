using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;

namespace SocialNetwork.Endpoints;

public class LikeEndpoints : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/posts/{postId}/likes")
            .WithTags("Likes");

        group.MapPost("", AddLike)
            .RequireAuthorization();

        group.MapDelete("", RemoveLike)
            .RequireAuthorization();
    }

    private static async Task<IResult> AddLike(int postId, ILikeService likeService, HttpContext httpContext)
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

    private static async Task<IResult> RemoveLike(int postId, ILikeService likeService, HttpContext httpContext)
    {
        var userId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        var result = await likeService.RemoveLikeAsync(postId, userId);
        
        if (!result)
        {
            return Results.NotFound("Like not found");
        }

        return Results.Ok();
    }
}
