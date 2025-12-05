using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SocialNetwork.Entity;


namespace SocialNetwork.Repository
{
    public interface IDirectMessageRepository
    {
        Task<DirectMessage> CreateAsync(DirectMessage message);
        Task<IEnumerable<DirectMessage>> GetConversationAsync(string user1Id, string user2Id);
        Task<IEnumerable<DirectMessage>> GetInboxAsync(string userId);
        Task MarkAsReadAsync(int messageId, string userId);
        Task<IEnumerable<DirectMessage>> GetUnreadMessagesAsync(string userId);
        Task<int> GetUnreadCountAsync(string userId);
        Task<DirectMessage> GetMessageByIdAsync(int messageId);


    }
}
