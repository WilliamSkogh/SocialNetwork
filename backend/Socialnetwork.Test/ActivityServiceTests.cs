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
        
        var like = new Like { PostId = 1, UserId = "user2", CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time")) };
        context.Set<Like>().Add(like);
        
        await context.SaveChangesAsync();

        var activities = await service.GetUserActivitiesAsync("user1");

        Assert.Single(activities);
        var activity = activities.First();
        Assert.Equal("like", activity.Type);
        Assert.Equal("user2", activity.ActorId);
        Assert.Equal("liker", activity.ActorUsername);
    }

    [Fact]
    public async Task GetUserActivitiesAsync_ShouldReturnDislikesOnUserPosts()
    {
        var context = GetInMemoryDbContext();
        var service = new ActivityService(context);
        
        var author = new ApplicationUser { Id = "user1", UserName = "testuser" };
        var disliker = new ApplicationUser { Id = "user2", UserName = "disliker" };
        
        context.Users.AddRange(author, disliker);
        
        var post = new Post { Id = 1, AuthorId = "user1", Content = "Test post" };
        context.Posts.Add(post);
        
        var dislike = new Dislike { PostId = 1, UserId = "user2", CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time")) };
        context.Set<Dislike>().Add(dislike);
        
        await context.SaveChangesAsync();

        var activities = await service.GetUserActivitiesAsync("user1");

        Assert.Single(activities);
        var activity = activities.First();
        Assert.Equal("dislike", activity.Type);
        Assert.Equal("user2", activity.ActorId);
        Assert.Equal("disliker", activity.ActorUsername);
    }

    [Fact]
    public async Task GetUserActivitiesAsync_ShouldReturnCommentsOnUserPosts()
    {
        var context = GetInMemoryDbContext();
        var service = new ActivityService(context);
        
        var author = new ApplicationUser { Id = "user1", UserName = "testuser" };
        var commenter = new ApplicationUser { Id = "user2", UserName = "commenter" };
        
        context.Users.AddRange(author, commenter);
        
        var post = new Post { Id = 1, AuthorId = "user1", Content = "Test post" };
        context.Posts.Add(post);
        
        var comment = new Comment { PostId = 1, UserId = "user2", Text = "Nice post!", CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time")) };
        context.Set<Comment>().Add(comment);
        
        await context.SaveChangesAsync();

        var activities = await service.GetUserActivitiesAsync("user1");

        Assert.Single(activities);
        var activity = activities.First();
        Assert.Equal("comment", activity.Type);
        Assert.Equal("user2", activity.ActorId);
        Assert.Equal("commenter", activity.ActorUsername);
        Assert.Equal("Nice post!", activity.CommentText);
    }

    [Fact]
    public async Task GetUserActivitiesAsync_ShouldReturnFollows()
    {
        var context = GetInMemoryDbContext();
        var service = new ActivityService(context);
        
        var user = new ApplicationUser { Id = "user1", UserName = "testuser" };
        var follower = new ApplicationUser { Id = "user2", UserName = "follower" };
        
        context.Users.AddRange(user, follower);
        
        var follow = new Follow { FollowerId = "user2", FollowingId = "user1", CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time")) };
        context.Set<Follow>().Add(follow);
        
        await context.SaveChangesAsync();

        var activities = await service.GetUserActivitiesAsync("user1");

        Assert.Single(activities);
        var activity = activities.First();
        Assert.Equal("follow", activity.Type);
        Assert.Equal("user2", activity.ActorId);
        Assert.Equal("follower", activity.ActorUsername);
    }
}
