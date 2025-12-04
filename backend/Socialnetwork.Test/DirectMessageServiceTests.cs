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
    public async Task CreateMessageShouldThrowWhenReceiverIdIsEmpty()
    {
        var message = new DirectMessage
        {
            SenderId = "user1",
            ReceiverId = "",
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

    [Fact]
    public async Task GetConversationShouldThrowWhenCurrentUserIdIsNullOrEmpty()
    {
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.GetConversationAsync(null, "user2")
        );
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.GetConversationAsync("", "user2")
        );
    }

    [Fact]
    public async Task GetConversationShouldThrowWhenOtherUserIdIsNullOrEmpty()
    {
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.GetConversationAsync("user1", null)
        );
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.GetConversationAsync("user1", "")
        );
    }

    [Fact]
    public async Task GetConversationShouldThrowWhenUserIdsAreEqual()
    {
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.GetConversationAsync("user1", "user1")
        );

    }

    [Fact]
    public async Task GetConversationShouldCallRepositoryWithCorrectIds()
    {

        var expectedMessages = new List<DirectMessage>();
        _directMessageRepoMock
            .Setup(r => r.GetConversationAsync("user1", "user2"))
            .ReturnsAsync(expectedMessages);

        await _directMessageService.GetConversationAsync("user1", "user2");

        _directMessageRepoMock.Verify(
            r => r.GetConversationAsync("user1", "user2"),
            Times.Once
        );
    }

    [Fact]
    public async Task GetConversationShouldReturnMessagesFromRepository()
    {
        var expected = new List<DirectMessage>
    {
        new DirectMessage { SenderId = "user1", ReceiverId = "user2", Message = "Hello" }
    };

        _directMessageRepoMock
            .Setup(r => r.GetConversationAsync("user1", "user2"))
            .ReturnsAsync(expected);

        var result = await _directMessageService.GetConversationAsync("user1", "user2");

        Assert.Equal(expected, result);
    }

    [Fact]
    public async Task GetConversationShouldReturnEmptyListWhenNoMessages()
    {
        _directMessageRepoMock
            .Setup(r => r.GetConversationAsync("user1", "user2"))
            .ReturnsAsync(new List<DirectMessage>());

        var result = await _directMessageService.GetConversationAsync("user1", "user2");

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetConversationShouldReturnAllMessages()
    {
        var messages = Enumerable.Range(1, 100)
            .Select(i => new DirectMessage { SenderId = "user1", ReceiverId = "user2", Message = $"Msg {i}" })
            .ToList();

        _directMessageRepoMock
            .Setup(r => r.GetConversationAsync("user1", "user2"))
            .ReturnsAsync(messages);

        var result = await _directMessageService.GetConversationAsync("user1", "user2");

        Assert.Equal(100, result.Count());
        Assert.Equal(messages, result);
    }

    [Fact]
    public async Task GetConversationShouldReturnMessagesInCorrectOrder()
    {
        var messages = new List<DirectMessage>
    {
        new DirectMessage { SenderId = "user1", ReceiverId = "user2", Message = "Second", Timestamp = DateTime.UtcNow.AddMinutes(1) },
        new DirectMessage { SenderId = "user2", ReceiverId = "user1", Message = "First", Timestamp = DateTime.UtcNow }
    };

        _directMessageRepoMock
            .Setup(r => r.GetConversationAsync("user1", "user2"))
            .ReturnsAsync(messages);

        var result = (await _directMessageService.GetConversationAsync("user1", "user2")).ToList();

        Assert.Equal("Second", result[0].Message);
    }

    [Fact]
    public async Task GetInboxAsyncShouldThrowWhenUserIdIsNull()
    {
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _directMessageService.GetInboxAsync(null)
        );
    }

    [Fact]
    public async Task GetInboxAsyncShouldReturnAllMessagesForUser()
    {
        var userId = "user1";
        var messages = new List<DirectMessage>
    {
        new DirectMessage { SenderId = "user2", ReceiverId = userId, Message = "Msg1" },
        new DirectMessage { SenderId = "user3", ReceiverId = userId, Message = "Msg2" }
    };

        _directMessageRepoMock
            .Setup(r => r.GetInboxAsync(userId))
            .ReturnsAsync(messages);

        var result = await _directMessageService.GetInboxAsync(userId);

        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task CreateMessageShouldSucceedWithValidMessage()
    {
        var message = new DirectMessage
        {
            SenderId = "user1",
            ReceiverId = "user2",
            Message = "Valid message"
        };

        _directMessageRepoMock
            .Setup(r => r.CreateAsync(It.IsAny<DirectMessage>()))
            .ReturnsAsync(message);

        var result = await _directMessageService.CreateMessageAsync(message);

        Assert.NotNull(result);
        _directMessageRepoMock.Verify(r => r.CreateAsync(It.IsAny<DirectMessage>()), Times.Once);
    }

    [Fact]
    public async Task CreateMessageShouldSetTimestampAndIsReadDefault()
    {
        var message = new DirectMessage
        {
            SenderId = "user1",
            ReceiverId = "user2",
            Message = "Test message"
        };

        _directMessageRepoMock
            .Setup(r => r.CreateAsync(It.IsAny<DirectMessage>()))
            .ReturnsAsync(message);

        var result = await _directMessageService.CreateMessageAsync(message);

        Assert.NotNull(result);
        Assert.False(result.IsRead);
    }

    [Fact]
    public async Task GetInboxAsyncShouldReturnEmptyListWhenNoMessages()
    {
        var userId = "user1";

        _directMessageRepoMock
            .Setup(r => r.GetInboxAsync(userId))
            .ReturnsAsync(new List<DirectMessage>());

        var result = await _directMessageService.GetInboxAsync(userId);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetInboxAsyncShouldReturnLatestPerSender()
    {
        var userId = "user1";

        var messages = new List<DirectMessage>
        {
            new DirectMessage
            {
                Id = 1,
                SenderId = "user2",
                ReceiverId = userId,
                Message = "Första meddelandet",
                Timestamp = DateTime.UtcNow.AddHours(-2),
                IsRead = true,
                Sender = new ApplicationUser { Id = "user2", UserName = "user2" }
            },
            new DirectMessage
            {
                Id = 2,
                SenderId = "user2",
                ReceiverId = userId,
                Message = "Andra meddelandet",
                Timestamp = DateTime.UtcNow.AddHours(-1),
                IsRead = true,
                Sender = new ApplicationUser { Id = "user2", UserName = "user2" }
            },
            new DirectMessage
            {
                Id = 3,
                SenderId = "user2",
                ReceiverId = userId,
                Message = "Senaste meddelandet",
                Timestamp = DateTime.UtcNow,
                IsRead = false,
                Sender = new ApplicationUser { Id = "user2", UserName = "user2" }
            },
            new DirectMessage
            {
                Id = 4,
                SenderId = "user3",
                ReceiverId = userId,
                Message = "Hej från user3",
                Timestamp = DateTime.UtcNow.AddMinutes(-30),
                IsRead = false,
                Sender = new ApplicationUser { Id = "user3", UserName = "user3" }
            }
        };

        _directMessageRepoMock
            .Setup(r => r.GetInboxAsync(userId))
            .ReturnsAsync(messages.Where(m => m.ReceiverId == userId)
                .GroupBy(m => m.SenderId)
                .Select(g => g.OrderByDescending(m => m.Timestamp).First())
                .OrderByDescending(m => m.Timestamp)
                .ToList());

        var result = (await _directMessageService.GetInboxAsync(userId)).ToList();

        Assert.Equal(2, result.Count);

        Assert.Equal("user2", result[0].SenderId);
        Assert.Equal("Senaste meddelandet", result[0].Message);
        Assert.Equal(3, result[0].Id);

        Assert.Equal("user3", result[1].SenderId);
    }

    [Fact]
    public async Task GetInboxAsyncShouldReturnUnreadCountPerSender()
    {
        var userId = "user1";

        var messages = new List<DirectMessage>
        {
            new DirectMessage
            {
                Id = 1,
                SenderId = "user2",
                ReceiverId = userId,
                Message = "Oläst 1",
                Timestamp = DateTime.UtcNow.AddHours(-2),
                IsRead = false,
                Sender = new ApplicationUser { Id = "user2", UserName = "user2" }
            },
            new DirectMessage
            {
                Id = 2,
                SenderId = "user2",
                ReceiverId = userId,
                Message = "Oläst 2",
                Timestamp = DateTime.UtcNow.AddHours(-1),
                IsRead = false,
                Sender = new ApplicationUser { Id = "user2", UserName = "user2" }
            },
            new DirectMessage
            {
                Id = 3,
                SenderId = "user2",
                ReceiverId = userId,
                Message = "Senaste från user2",
                Timestamp = DateTime.UtcNow,
                IsRead = false,
                Sender = new ApplicationUser { Id = "user2", UserName = "user2" }
            },
            new DirectMessage
            {
                Id = 4,
                SenderId = "user3",
                ReceiverId = userId,
                Message = "Läst meddelande",
                Timestamp = DateTime.UtcNow.AddMinutes(-30),
                IsRead = true,
                Sender = new ApplicationUser { Id = "user3", UserName = "user3" }
            }
        };

        _directMessageRepoMock
            .Setup(r => r.GetInboxAsync(userId))
            .ReturnsAsync(messages.Where(m => m.ReceiverId == userId)
                .GroupBy(m => m.SenderId)
                .Select(g => new DirectMessage
                {
                    Id = g.OrderByDescending(m => m.Timestamp).First().Id,
                    SenderId = g.Key,
                    ReceiverId = userId,
                    Message = g.OrderByDescending(m => m.Timestamp).First().Message,
                    Timestamp = g.Max(m => m.Timestamp),
                    IsRead = g.OrderByDescending(m => m.Timestamp).First().IsRead,
                    Sender = g.First().Sender,
                    UnreadCount = g.Count(m => !m.IsRead) 
                })
                .OrderByDescending(m => m.Timestamp)
                .ToList());

        var result = (await _directMessageService.GetInboxAsync(userId)).ToList();

        Assert.Equal(2, result.Count);

        
        var user2Message = result.First(m => m.SenderId == "user2");
        Assert.Equal(3, user2Message.UnreadCount);

        var user3Message = result.First(m => m.SenderId == "user3");
        Assert.Equal(0, user3Message.UnreadCount);
    }



}
