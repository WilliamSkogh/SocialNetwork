using SocialNetwork.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialNetwork.Service
{
    internal interface IDirectMessageService
    {
        Task<DirectMessage> CreateMessageAsync(DirectMessage message);
    }
}
