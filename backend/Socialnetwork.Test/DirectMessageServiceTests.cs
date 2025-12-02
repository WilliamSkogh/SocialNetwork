using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SocialNetwork.Entity;
using SocialNetwork.Repository;
using SocialNetwork.Service;
using Xunit;

public class DirectMessageServiceTests
{
    private readonly Mock<IDirectMessageRepository> _directMessageRepoMock;
    private readonly DirectMessageService _directMessageService;
    public DirectMessageServiceTests()
    {
        _directMessageRepoMock = new Mock<IDirectMessageRepository>();
        _directMessageService = new DirectMessageService(_directMessageRepoMock.Object);
    }

    [Fact]
    public async Task CreateMessageShouldThrowWhenMessageIsEmpty()
    {
        var message = new DirectMessage
        {
            SenderId = "user1",
            ReceiverId = "user2",
            Message = ""
        };

        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.CreateMessageAsync(message)
        );
    }
}
