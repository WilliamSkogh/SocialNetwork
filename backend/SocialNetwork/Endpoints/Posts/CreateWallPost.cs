using SocialNetwork.Api.Abstractions;
using SocialNetwork.Api.DTOs;
using SocialNetwork.Entity;
using SocialNetwork.Service;
using Microsoft.AspNetCore.Mvc;

namespace SocialNetwork.Api.Endpoints.Posts;

public class CreateWallPostEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/users/{recipientId}/posts", CreateWallPost)
            .WithName("CreateWallPost")
            .WithTags("Posts")
            .RequireAuthorization()
            .DisableAntiforgery();
    }

    private static async Task<IResult> CreateWallPost(
        string recipientId,
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
                RecipientId = recipientId,
                Content = content,
                ImageUrl = imageUrl
            };

            var createdPost = await postService.CreatePostAsync(post);

            var response = PostResponseHelper.ToPostResponse(createdPost, userId);

            return Results.Created($"/api/posts/{createdPost.Id}", response);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }
}
