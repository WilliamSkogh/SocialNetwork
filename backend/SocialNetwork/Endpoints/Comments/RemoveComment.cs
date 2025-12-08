using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;

namespace SocialNetwork.Endpoints.Comments;

public class RemoveComment : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("api/comments/{commentId}", HandleAsync)
            .WithTags("Comments")
            .RequireAuthorization();
    }

    private static async Task<IResult> HandleAsync(int commentId, ICommentService commentService)
    {
        var result = await commentService.RemoveCommentAsync(commentId);
        
        if (!result)
        {
            return Results.BadRequest("Failed to remove comment");
        }

        return Results.Ok();
    }
}
