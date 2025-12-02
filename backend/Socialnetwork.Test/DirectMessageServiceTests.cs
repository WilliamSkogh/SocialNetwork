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
    [Fact]
    public async Task CreateMessageShouldThrowWhenMessageIsEmpty()
    {
        // Arrange
        var repoMock = new Mock<IDirectMessageRepository>();

        var message = new DirectMessage
        {
            SenderId = "user1",
            ReceiverId = "user2",
            Message = ""  
        };

        repoMock.Setup(r => r.CreateAsync(message)).ReturnsAsync(message);

        var service = new DirectMessageService(repoMock.Object);


        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.CreateMessageAsync(message)
        );
    }
}
