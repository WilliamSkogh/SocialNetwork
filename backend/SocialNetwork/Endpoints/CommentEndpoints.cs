using SocialNetwork.Api.Abstractions;
using SocialNetwork.DTOs;
using SocialNetwork.Service;

namespace SocialNetwork.Endpoints;

public class CommentEndpoints : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/posts/{postId}/comments")
            .WithTags("Comments");

        group.MapPost("", AddComment)
            .RequireAuthorization();

        var commentsGroup = app.MapGroup("api/comments")
            .WithTags("Comments");

        commentsGroup.MapDelete("{commentId}", RemoveComment)
            .RequireAuthorization();
    }

    private static async Task<IResult> AddComment(int postId, AddCommentRequest request, ICommentService commentService, HttpContext httpContext)
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

    private static async Task<IResult> RemoveComment(int commentId, ICommentService commentService)
    {
        var result = await commentService.RemoveCommentAsync(commentId);
        
        if (!result)
        {
            return Results.NotFound("Comment not found");
        }

        return Results.Ok();
    }
}
