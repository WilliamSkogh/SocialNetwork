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

        group.MapGet("/conversation/{otherUserId}", GetConversation)
            .WithName("GetConversation")
            .WithDescription("Hämta en konversation med en annan användare");
        
        group.MapGet("/inbox", GetInbox)
                   .WithName("GetInbox")
                   .WithDescription("Hämta alla mottagna meddelanden");

    }

    private static async Task<IResult> SendMessage( DirectMessageCreateDto dto,ClaimsPrincipal user,IDirectMessageService service)
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

   
    private static async Task<IResult> GetConversation(string otherUserId,ClaimsPrincipal user,IDirectMessageService service)
    {
        try
        {
            var currentUserId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
                return Results.Unauthorized();

            var messages = await service.GetConversationAsync(currentUserId, otherUserId);

            var dtoList = messages.Select(m => new DirectMessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderUsername = m.Sender?.UserName,
                ReceiverId = m.ReceiverId,
                ReceiverUsername = m.Receiver?.UserName,
                Message = m.Message,
                Timestamp = m.Timestamp,
                IsRead = m.IsRead
            }).ToList();

            return Results.Ok(dtoList);
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

    private static async Task<IResult> GetInbox(
       ClaimsPrincipal user,
       IDirectMessageService service)
    {
        try
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var messages = await service.GetInboxAsync(userId);

            var dtoList = messages.Select(m => new DirectMessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderUsername = m.Sender?.UserName,
                ReceiverId = m.ReceiverId,
                ReceiverUsername = m.Receiver?.UserName,
                Message = m.Message,
                Timestamp = m.Timestamp,
                IsRead = m.IsRead,
                UnreadCount = m.UnreadCount 
            }).ToList();

            return Results.Ok(dtoList);
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



