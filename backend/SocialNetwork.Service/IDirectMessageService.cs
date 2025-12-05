using SocialNetwork.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialNetwork.Service
{
    public interface IDirectMessageService
    {
        Task<DirectMessage> CreateMessageAsync(DirectMessage message);
        Task<IEnumerable<DirectMessage>> GetConversationAsync(string currentUserId, string otherUserId);
        Task<IEnumerable<DirectMessage>> GetInboxAsync(string userId);
        Task MarkMessageAsReadAsync(int messageId, string userId);
        Task<IEnumerable<DirectMessage>> GetUnreadMessagesAsync(string userId);
        Task<int> GetUnreadCountAsync(string userId);
        Task<DirectMessage> GetMessageByIdAsync(int messageId);


    }
}
