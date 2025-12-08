using SocialNetwork.Api.Abstractions;
using SocialNetwork.Api.DTOs;
using SocialNetwork.Service;
using SocialNetwork.Api.Endpoints;

namespace SocialNetwork.Api.Endpoints.Posts;

public class GetUserProfilePostsEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/{userId}/posts", GetUserProfilePosts)
            .WithName("GetUserProfilePosts")
            .WithTags("Posts");
    }

    private static async Task<IResult> GetUserProfilePosts(string userId, IPostService postService, HttpContext httpContext)
    {
        var currentUserId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        var posts = await postService.GetUserProfilePostsAsync(userId);
        var response = posts.Select(p => PostResponseHelper.ToPostResponse(p, currentUserId));
        return Results.Ok(response);
    }
}
