using System;
using System.Collections.Generic;
using System.Text;
using SocialNetwork.Entity;
using SocialNetwork.Repository;


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

            return await _repo.CreateAsync(message);
        }

    }
}
