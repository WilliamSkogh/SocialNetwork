using Microsoft.EntityFrameworkCore;
using SocialNetwork.Api.DTOs;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;

namespace SocialNetwork.Api.Endpoints;

public static class PostEndpoints
{
    public static void MapPostEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/posts")
            .WithTags("Posts");

        group.MapPost("/", CreatePost)
            .WithName("CreatePost");  
    }

    private static async Task<IResult> CreatePost(
    ApplicationDbContext context,
    PostRequest request)
{
    try
    {
        
        var authorExists = await context.Users.AnyAsync(u => u.Id == request.AuthorId);
        if (!authorExists)
        {
            return Results.BadRequest(new { error = "Author not found" });
        }

        
        var recipientExists = await context.Users.AnyAsync(u => u.Id == request.RecipientId);
        if (!recipientExists)
        {
            return Results.BadRequest(new { error = "Recipient not found" });
        }

        var post = new Post
        {
            AuthorId = request.AuthorId,
            RecipientId = request.RecipientId,
            Content = request.Content
        };

        context.Posts.Add(post);
        await context.SaveChangesAsync();

        var response = new PostResponse(
            post.Id,
            post.AuthorId,
            post.RecipientId,
            post.Content,
            post.CreatedAt
        );

        return Results.Created($"/api/posts/{post.Id}", response);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
}
}


