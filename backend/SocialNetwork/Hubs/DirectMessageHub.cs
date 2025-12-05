using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Entity;
using SocialNetwork.Service;
using System.Security.Claims;

namespace SocialNetwork.Api.Hubs;

[Authorize]
public class DirectMessageHub : Hub
{
    private readonly IDirectMessageService _directMessageService;
    public DirectMessageHub(IDirectMessageService directMessageService)
    {
        _directMessageService = directMessageService;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {

            await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
        }

        await base.OnConnectedAsync();
    }

    public async Task SendDirectMessage(string receiverId, string message)
    {
        var senderId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(senderId))
        {
            await Clients.Caller.SendAsync("Error", "Unauthorized");
            return;
        }

        try
        {
            var directMessage = new DirectMessage
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Message = message,
                Timestamp = DateTime.UtcNow,
                IsRead = false
            };

            var savedMessage = await _directMessageService.CreateMessageAsync(directMessage);

            await Clients.Group($"user-{receiverId}").SendAsync("ReceiveDirectMessage", new
            {
                id = savedMessage.Id,
                senderId = savedMessage.SenderId,
                receiverId = savedMessage.ReceiverId,
                message = savedMessage.Message,
                timestamp = savedMessage.Timestamp,
                isRead = savedMessage.IsRead
            });

            await Clients.Caller.SendAsync("MessageSent", new
            {
                id = savedMessage.Id,
                receiverId = receiverId,
                message = message,
                timestamp = savedMessage.Timestamp,
                isRead = false
            });
        }
        catch (ArgumentException ex)
        {
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Ett fel uppstod: {ex.Message}");
        }
    }


    public async Task UserTyping(string receiverId)
    {
        var senderId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await Clients.Group($"user-{receiverId}").SendAsync("UserIsTyping", senderId);
    }

    public async Task UserStoppedTyping(string receiverId)
    {
        var senderId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await Clients.Group($"user-{receiverId}").SendAsync("UserStoppedTyping", senderId);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user-{userId}");
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task MarkMessageAsRead(int messageId)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
        {
            await _directMessageService.MarkMessageAsReadAsync(messageId, userId);
            await Clients.Group($"user-{userId}").SendAsync("MessageMarkedAsRead", messageId);
        }
    }





}