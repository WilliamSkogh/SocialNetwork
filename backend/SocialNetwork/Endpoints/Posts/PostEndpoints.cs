using SocialNetwork.Api.Abstractions;
using SocialNetwork.Api.DTOs;
using SocialNetwork.Entity;
using SocialNetwork.Service;

namespace SocialNetwork.Api.Endpoints;

public class CreatePostEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/posts", CreatePost)
            .WithName("CreatePost")
            .WithTags("Posts");
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
                Content = request.Content,
                ImageUrl = request.ImageUrl
            };

            var createdPost = await postService.CreatePostAsync(post);

            var response = new PostResponse(
                createdPost.Id,
                createdPost.AuthorId,
                createdPost.RecipientId,
                createdPost.Content,
                createdPost.ImageUrl,
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

public class GetAllPostsEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/posts", GetAllPosts)
            .WithName("GetAllPosts")
            .WithTags("Posts");
    }

    private static async Task<IResult> GetAllPosts(IPostService postService)
    {
        var posts = await postService.GetAllPostsAsync();
        var response = posts.Select(p => new PostResponse(
            p.Id,
            p.AuthorId,
            p.RecipientId,
            p.Content,
            p.ImageUrl,
            p.CreatedAt
        ));
        return Results.Ok(response);
    }
}

public class GetPostByIdEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/posts/{id}", GetPostById)
            .WithName("GetPostById")
            .WithTags("Posts");
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
            post.ImageUrl,
            post.CreatedAt
        );
        return Results.Ok(response);
    }
}

public class UpdatePostEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/posts/{id}", UpdatePost)
            .WithName("UpdatePost")
            .WithTags("Posts");
    }

    private static async Task<IResult> UpdatePost(IPostService postService, int id, UpdatePostRequest request)
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
                updatedPost.ImageUrl,
                updatedPost.CreatedAt
            );
            return Results.Ok(response);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }
}

public class DeletePostEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/posts/{id}", DeletePost)
            .WithName("DeletePost")
            .WithTags("Posts");
    }

    private static async Task<IResult> DeletePost(IPostService postService, int id)
    {
        var deleted = await postService.DeletePostAsync(id);
        if (!deleted)
            return Results.NotFound(new { error = "Post not found" });

        return Results.NoContent();
    }
}
