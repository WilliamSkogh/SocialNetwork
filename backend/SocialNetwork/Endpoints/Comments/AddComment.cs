using SocialNetwork.Api.Abstractions;
using SocialNetwork.DTOs;
using SocialNetwork.Service;

namespace SocialNetwork.Endpoints.Comments;

public class AddComment : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("api/posts/{postId}/comments", HandleAsync)
            .WithTags("Comments")
            .RequireAuthorization();
    }

    private static async Task<IResult> HandleAsync(int postId, AddCommentRequest request, ICommentService commentService, HttpContext httpContext)
    {
        var userId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return Results.BadRequest("Comment text is required");
        }

        var result = await commentService.AddCommentAsync(postId, userId, request.Text);
        
        if (!result)
        {
            return Results.BadRequest("Failed to add comment");
        }

        return Results.Ok();
    }
}
