using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;

namespace SocialNetwork.Repository
{
    public class DirectMessageRepository : IDirectMessageRepository
    {
        private readonly ApplicationDbContext _context;

        public DirectMessageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DirectMessage> CreateAsync(DirectMessage message)
        {
            if (message == null)
                throw new ArgumentNullException(nameof(message));

            if (message.Timestamp == default)
                message.Timestamp = DateTime.UtcNow;

            _context.DirectMessages.Add(message);

            await _context.SaveChangesAsync();

            return message;
        }

        public async Task<IEnumerable<DirectMessage>> GetConversationAsync(string user1Id, string user2Id)
        {
            if (string.IsNullOrWhiteSpace(user1Id) || string.IsNullOrWhiteSpace(user2Id))
                throw new ArgumentException("User IDs cannot be null or empty");

            return await _context.DirectMessages
                .Where(m =>
                    (m.SenderId == user1Id && m.ReceiverId == user2Id) ||
                    (m.SenderId == user2Id && m.ReceiverId == user1Id)
                )
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<DirectMessage>> GetInboxAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("UserId cannot be null or empty");

            var conversationPartners = await _context.DirectMessages
                .Where(m => m.ReceiverId == userId || m.SenderId == userId)
                .Select(m => m.ReceiverId == userId ? m.SenderId : m.ReceiverId)
                .Distinct()
                .ToListAsync();

            var result = new List<DirectMessage>();

            foreach (var partnerId in conversationPartners)
            {
                var latestMessage = await _context.DirectMessages
                    .Where(m => (m.SenderId == userId && m.ReceiverId == partnerId) ||
                                (m.SenderId == partnerId && m.ReceiverId == userId))
                    .OrderByDescending(m => m.Timestamp)
                    .Include(m => m.Sender)
                    .Include(m => m.Receiver)
                    .FirstOrDefaultAsync();

                if (latestMessage != null)
                {
                    var unreadCount = await _context.DirectMessages
                        .Where(m => m.SenderId == partnerId && m.ReceiverId == userId && !m.IsRead)
                        .CountAsync();

                    latestMessage.UnreadCount = unreadCount;
                    result.Add(latestMessage);
                }
            }

            return result.OrderByDescending(m => m.Timestamp).ToList();
        }

        public async Task<DirectMessage> GetMessageByIdAsync(int messageId)
        {
            if (messageId <= 0)
                throw new ArgumentException("MessageId must be greater than 0");

            return await _context.DirectMessages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .FirstOrDefaultAsync(m => m.Id == messageId);
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {

            return await _context.DirectMessages
                .CountAsync(m => m.ReceiverId == userId && !m.IsRead);
        }

        public async Task<IEnumerable<DirectMessage>> GetUnreadMessagesAsync(string userId)
        {


            return await _context.DirectMessages
                .Where(m => m.ReceiverId == userId && !m.IsRead)
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .OrderByDescending(m => m.Timestamp)
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(int messageId, string userId)
        {
            var message = await _context.DirectMessages.FindAsync(messageId);

            if (message != null && message.ReceiverId == userId)
            {
                message.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task <DirectMessage> GetLatestDirectMessageBetweenUsersAsync(string user1Id, string user2Id)
        {
            if (string.IsNullOrWhiteSpace(user1Id) || string.IsNullOrWhiteSpace(user2Id))
                throw new ArgumentException("User IDs cannot be null or empty");
            return await _context.DirectMessages
                .Where(m =>
                    (m.SenderId == user1Id && m.ReceiverId == user2Id) ||
                    (m.SenderId == user2Id && m.ReceiverId == user1Id)
                )
                .OrderByDescending(m => m.Timestamp)
                .FirstOrDefaultAsync();
        }

    }
}


