
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Api.Abstractions;
using SocialNetwork.Api.DTOs;
using SocialNetwork.Entity;

namespace SocialNetwork.Api.Endpoints.Users;

public class Register : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/auth/signup",  HandleRegister).WithTags("Auth").AllowAnonymous();
    }
    
    
    private static async Task<IResult> HandleRegister([FromBody] RegisterRequestDto requestDto, UserManager<ApplicationUser> userManager)
    {
        var user = new ApplicationUser
        {
            UserName = requestDto.Username,
            Email = requestDto.Email
        };
        var result = await userManager.CreateAsync(user, requestDto.Password);
        if (result.Succeeded)
        {
            return Results.Ok(new { Message = "Registrering lyckades!" });
        }
        return Results.ValidationProblem(result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description }));

    }
}
