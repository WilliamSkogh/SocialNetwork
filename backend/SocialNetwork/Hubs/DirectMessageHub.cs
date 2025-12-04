using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace SocialNetwork.Api.Hubs;

[Authorize]
public class DirectMessageHub : Hub
{

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

        await Clients.Group($"user-{receiverId}").SendAsync("ReceiveDirectMessage", new
        {
            senderId = senderId,
            message = message,
            timestamp = DateTime.UtcNow
        });

        await Clients.Caller.SendAsync("MessageSent", new
        {
            receiverId = receiverId,
            message = message,
            timestamp = DateTime.UtcNow
        });
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




}