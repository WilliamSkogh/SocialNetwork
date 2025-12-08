using SocialNetwork.Api.Abstractions;
using SocialNetwork.Service;

namespace SocialNetwork.Api.Endpoints.Users;

public class SearchUsers : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/search", async (string query, IProfileService profileService) =>
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            {
                return Results.Ok(Array.Empty<object>());
            }

            var results = await profileService.SearchUsersAsync(query, 8);
            return Results.Ok(results);
        })
        .WithTags("Users")
        .RequireAuthorization();
    }
}
