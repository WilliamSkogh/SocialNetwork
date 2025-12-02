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
    [Fact]
    public async Task CreateMessageShouldThrowWhenMessageIsNull()
    {
        var message = new DirectMessage
        {
            SenderId = "user1",
            ReceiverId = "user2",
            Message = null
        };

        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.CreateMessageAsync(message)
        );
    }


    [Fact]
    public async Task CreateMessageShouldThrowWhenSenderIdIsNull()
    {
        var message = new DirectMessage
        {
            SenderId = null,
            ReceiverId = "user2",
            Message = "Hello"
        };
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.CreateMessageAsync(message)
        );

    }
    [Fact]
    public async Task CreateMessageShouldThrowWhenSenderIdIsEmpty()
    {
        var message = new DirectMessage
        {
            SenderId = "",
            ReceiverId = "user2",
            Message = "Hello"
        };
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.CreateMessageAsync(message)
        );

    }

    [Fact]
    public async Task CreateMessageShouldThrowWhenReceiverIdIsNull()
    {
        var message = new DirectMessage
        {
            SenderId = "user1",
            ReceiverId = null,
            Message = "Hello"
        };
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.CreateMessageAsync(message)
        );
    }
    [Fact]
    public async Task CreateMessageShouldThrowWhenRecieverIdEqualSenderId()
    {
        var message = new DirectMessage
        {
            SenderId = "user1",
            ReceiverId = "user1",
            Message = "Hello"
        };
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.CreateMessageAsync(message)
        );
    }

    [Fact]
    public async Task CreateMessageShouldThrowWhenMessageTooLong()
    {
        var message = new DirectMessage
        {
            SenderId = "user1",
            ReceiverId = "user2",
            Message = new string('a', 1001) 
        };
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.CreateMessageAsync(message)
        );
    }







}
