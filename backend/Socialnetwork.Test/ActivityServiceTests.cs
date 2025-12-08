using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using SocialNetwork.Service;

namespace Socialnetwork.Test;

public class ActivityServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetUserActivitiesAsync_ShouldReturnLikesOnUserPosts()
    {
        var context = GetInMemoryDbContext();
        var service = new ActivityService(context);
        
        var author = new ApplicationUser { Id = "user1", UserName = "testuser" };
        var liker = new ApplicationUser { Id = "user2", UserName = "liker" };
        
        context.Users.AddRange(author, liker);
        
        var post = new Post { Id = 1, AuthorId = "user1", Content = "Test post" };
        context.Posts.Add(post);
        
        var like = new Like { PostId = 1, UserId = "user2", CreatedAt = DateTime.UtcNow };
        context.Set<Like>().Add(like);
        
        await context.SaveChangesAsync();

        var activities = await service.GetUserActivitiesAsync("user1");

        Assert.Single(activities);
        var activity = activities.First();
        Assert.Equal("like", activity.Type);
        Assert.Equal("user2", activity.ActorId);
        Assert.Equal("liker", activity.ActorUsername);
    }
}
