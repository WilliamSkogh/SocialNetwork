using SocialNetwork.Api.Abstractions;
using SocialNetwork.Api.DTOs;
using SocialNetwork.Entity;
using SocialNetwork.Service;
using Microsoft.AspNetCore.Mvc;

namespace SocialNetwork.Api.Endpoints;

public class CreatePostEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/posts", CreatePost)
            .WithName("CreatePost")
            .WithTags("Posts")
            .RequireAuthorization()
            .DisableAntiforgery();
    }

    private static async Task<IResult> CreatePost(
        [FromForm] string content,
        IFormFile? imageFile,
        HttpContext httpContext,
        IPostService postService,
        IMediaUploadService mediaService)
    {
        var userId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        try
        {
            string? imageUrl = null;
            
            if (imageFile != null)
            {
                imageUrl = await mediaService.UploadFileAsync(imageFile, "posts");
            }

            var post = new Post
            {
                AuthorId = userId,
                Content = content,
                ImageUrl = imageUrl
            };

            var createdPost = await postService.CreatePostAsync(post);

            var response = new PostResponse(
                createdPost.Id,
                createdPost.AuthorId,
                createdPost.Author?.UserName ?? "Unknown",
                createdPost.RecipientId,
                createdPost.Content,
                createdPost.ImageUrl,
                createdPost.CreatedAt,
                0,
                0,
                new List<CommentDto>()
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
            p.Author?.UserName ?? "Unknown",
            p.RecipientId,
            p.Content,
            p.ImageUrl,
            p.CreatedAt,
            p.Likes?.Count ?? 0,
            p.Dislikes?.Count ?? 0,
            p.Comments?.Select(c => new CommentDto(
                c.Id,
                c.UserId,
                c.User?.UserName ?? "Unknown",
                c.Text,
                c.CreatedAt
            )).ToList() ?? new List<CommentDto>()
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
            post.Author?.UserName ?? "Unknown",
            post.RecipientId,
            post.Content,
            post.ImageUrl,
            post.CreatedAt,
            post.Likes?.Count ?? 0,
            post.Dislikes?.Count ?? 0,
            post.Comments?.Select(c => new CommentDto(
                c.Id,
                c.UserId,
                c.User?.UserName ?? "Unknown",
                c.Text,
                c.CreatedAt
            )).ToList() ?? new List<CommentDto>()
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
                updatedPost.Author?.UserName ?? "Unknown",
                updatedPost.RecipientId,
                updatedPost.Content,
                updatedPost.ImageUrl,
                updatedPost.CreatedAt,
                updatedPost.Likes?.Count ?? 0,
                updatedPost.Dislikes?.Count ?? 0,
                updatedPost.Comments?.Select(c => new CommentDto(
                    c.Id,
                    c.UserId,
                    c.User?.UserName ?? "Unknown",
                    c.Text,
                    c.CreatedAt
                )).ToList() ?? new List<CommentDto>()
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
            .WithTags("Posts")
            .RequireAuthorization();
    }

    private static async Task<IResult> DeletePost(IPostService postService, int id, HttpContext httpContext)
    {
        var userId = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        var post = await postService.GetPostByIdAsync(id);
        if (post == null)
            return Results.NotFound(new { error = "Post not found" });

        if (post.AuthorId != userId)
        {
            return Results.Forbid();
        }

        var deleted = await postService.DeletePostAsync(id);
        if (!deleted)
            return Results.NotFound(new { error = "Post not found" });

        return Results.NoContent();
    }
}

public class UploadPostImageEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/posts/upload-image", UploadImage)
            .WithName("UploadPostImage")
            .WithTags("Posts")
            .DisableAntiforgery();
    }

    private static async Task<IResult> UploadImage(
        [FromServices] IMediaUploadService mediaUploadService,
        IFormFile file)
    {
        try
        {
            var imageUrl = await mediaUploadService.UploadFileAsync(file, "posts");
            return Results.Ok(imageUrl);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }
}
