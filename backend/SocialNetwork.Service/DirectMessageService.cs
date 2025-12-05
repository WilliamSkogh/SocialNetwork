using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Repository;
using System;
using System.Collections.Generic;
using System.Text;


namespace SocialNetwork.Service
{
    public class DirectMessageService : IDirectMessageService
    {
        private readonly IDirectMessageRepository _repo;

        public DirectMessageService(IDirectMessageRepository repo)
        {
            _repo = repo;
        }

        public async Task<DirectMessage> CreateMessageAsync(DirectMessage message)
        {
            if (string.IsNullOrWhiteSpace(message.Message))
                throw new ArgumentException("Message content cannot be empty");

            if (string.IsNullOrWhiteSpace(message.SenderId))
                throw new ArgumentException("SenderId cannot be null or empty");

            if (string.IsNullOrWhiteSpace(message.ReceiverId))
                throw new ArgumentException("ReceiverId cannot be null or empty");

            if (message.ReceiverId == message.SenderId)
                throw new ArgumentException("SenderId and ReceiverId cannot be the same");

            if (message.Message.Length > 1000)
                throw new ArgumentException("Message content exceeds maximum length of 1000 characters");

            return await _repo.CreateAsync(message);
        }

        public Task<IEnumerable<DirectMessage>> GetConversationAsync(string currentUserId, string otherUserId)
        {
            if (string.IsNullOrWhiteSpace(currentUserId))
                throw new ArgumentException("CurrentUserId cannot be null or empty");

            if (string.IsNullOrWhiteSpace(otherUserId))
                throw new ArgumentException("OtherUserId cannot be null or empty");

            if (currentUserId == otherUserId)
                throw new ArgumentException("CurrentUserId and OtherUserId cannot be the same");

            return _repo.GetConversationAsync(currentUserId, otherUserId);
        }

        public Task<IEnumerable<DirectMessage>> GetInboxAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("UserId cannot be null or empty");

            return _repo.GetInboxAsync(userId);
        }

        public Task<DirectMessage> GetMessageByIdAsync(int messageId)
        {
            throw new NotImplementedException();
        }

        public Task<int> GetUnreadCountAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("UserId cannot be null or empty");

            return _repo.GetUnreadCountAsync(userId);
        }

        public Task<IEnumerable<DirectMessage>> GetUnreadMessagesAsync(string userId)
        {
            
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("UserId cannot be null or empty");
            return _repo.GetUnreadMessagesAsync(userId);
        }

        public Task MarkMessageAsReadAsync(int messageId, string userId)
        {
            if (messageId <= 0)
                throw new ArgumentException("MessageId must be greater than 0");

            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("UserId cannot be null or empty");

            return _repo.MarkAsReadAsync(messageId, userId);

        }
    }
}
