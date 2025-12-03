using Microsoft.EntityFrameworkCore;
using SocialNetwork.Api.DTOs;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using SocialNetwork.Service;

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
        IPostService postService,
        PostRequest request)
    {
        try
        {
            var post = new Post
            {
                AuthorId = request.AuthorId,
                RecipientId = request.RecipientId,
                Content = request.Content
            };

            var createdPost = await postService.CreatePostAsync(post);

            var response = new PostResponse(
                createdPost.Id,
                createdPost.AuthorId,
                createdPost.RecipientId,
                createdPost.Content,
                createdPost.CreatedAt
            );

            return Results.Created($"/api/posts/{createdPost.Id}", response);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }
}