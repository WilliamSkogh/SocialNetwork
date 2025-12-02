using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using SocialNetwork.Repository;

namespace Socialnetwork.Repository
{
    internal class DirectMessageRepository:IDirectMessageRepository
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

        public Task<IEnumerable<DirectMessage>> GetConversationAsync(string user1Id, string user2Id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<DirectMessage>> GetMessagesForUserAsync(string userId)
        {
            throw new NotImplementedException();
        }
    }
}
