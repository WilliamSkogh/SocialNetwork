using SocialNetwork.Api.Abstractions;
using SocialNetwork.Api.DTOs;
using SocialNetwork.Entity;
using SocialNetwork.Service;
using System.Security.Claims;

namespace SocialNetwork.Api.Endpoints.DirectMessages;

public class DirectMessagesEndpoints : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/messages")
            .WithTags("DirectMessages")
            .RequireAuthorization();

        group.MapPost("/", SendMessage)
            .WithName("SendMessage")
            .WithDescription("Skicka ett direktmeddelande till en användare");

    }

    private static async Task<IResult> SendMessage(
        DirectMessageCreateDto dto,
        ClaimsPrincipal user,
        IDirectMessageService service)
    {
        try
        {
            var senderId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(senderId))
                return Results.Unauthorized();

            var directMessage = new DirectMessage
            {
                SenderId = senderId,
                ReceiverId = dto.ReceiverId,
                Message = dto.Message
            };

           
            var createdMessage = await service.CreateMessageAsync(directMessage);

            
            var resultDto = new DirectMessageDto
            {
                Id = createdMessage.Id,
                SenderId = createdMessage.SenderId,
                ReceiverId = createdMessage.ReceiverId,
                Message = createdMessage.Message,
                Timestamp = createdMessage.Timestamp,
                IsRead = createdMessage.IsRead
            };

            return Results.Created($"/api/messages/{createdMessage.Id}", resultDto);
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return Results.Problem($"Ett fel uppstod: {ex.Message}");
        }
    }

    
}