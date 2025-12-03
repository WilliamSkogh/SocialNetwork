using SocialNetwork.Api.DTOs;
using SocialNetwork.Entity;
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
        
        group.MapGet("/", GetAllPosts)
            .WithName("GetAllPosts");
        
        group.MapGet("/{id}", GetPostById)
            .WithName("GetPostById");
        
        group.MapPut("/{id}", UpdatePost)
            .WithName("UpdatePost");
        
        group.MapDelete("/{id}", DeletePost)
            .WithName("DeletePost");
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

    private static async Task<IResult> GetAllPosts(IPostService postService)
    {
        var posts = await postService.GetAllPostsAsync();
        var response = posts.Select(p => new PostResponse(
            p.Id,
            p.AuthorId,
            p.RecipientId,
            p.Content,
            p.CreatedAt
        ));
        return Results.Ok(response);
    }

    private static async Task<IResult> GetPostById(IPostService postService, int id)
    {
        var post = await postService.GetPostByIdAsync(id);
        if (post == null)
            return Results.NotFound(new { error = "Post not found" });

        var response = new PostResponse(
            post.Id,
            post.AuthorId,
            post.RecipientId,
            post.Content,
            post.CreatedAt
        );
        return Results.Ok(response);
    }

    private static async Task<IResult> UpdatePost(
        IPostService postService,
        int id,
        UpdatePostRequest request)
    {
        try
        {
            var updatedPost = await postService.UpdatePostAsync(id, request.Content);
            if (updatedPost == null)
                return Results.NotFound(new { error = "Post not found" });

            var response = new PostResponse(
                updatedPost.Id,
                updatedPost.AuthorId,
                updatedPost.RecipientId,
                updatedPost.Content,
                updatedPost.CreatedAt
            );
            return Results.Ok(response);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }

    private static async Task<IResult> DeletePost(IPostService postService, int id)
    {
        var deleted = await postService.DeletePostAsync(id);
        if (!deleted)
            return Results.NotFound(new { error = "Post not found" });

        return Results.NoContent();
    }
}
