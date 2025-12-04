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

            var latestPerSender = await _context.DirectMessages
                .Where(m => m.ReceiverId == userId)
                .GroupBy(m => m.SenderId)
                .Select(g => new
                {
                    SenderId = g.Key,
                    LatestTimestamp = g.Max(m => m.Timestamp),
                    UnreadCount = g.Count(m => !m.IsRead)  
                })
                .ToListAsync();

            var result = new List<DirectMessage>();

            foreach (var item in latestPerSender)
            {
                var message = await _context.DirectMessages
                    .Where(m => m.ReceiverId == userId
                        && m.SenderId == item.SenderId
                        && m.Timestamp == item.LatestTimestamp)
                    .Include(m => m.Sender)
                    .Include(m => m.Receiver)
                    .FirstOrDefaultAsync();

                if (message != null)
                {
                   
                    message.UnreadCount = item.UnreadCount;
                    result.Add(message);
                }
            }

            return result.OrderByDescending(m => m.Timestamp).ToList();
        }
    }
}
    

