using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using Xunit;


namespace Socialnetwork.Test.EndpointTests;

public class PostEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public PostEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase("PostEndpointTestsDb");
                });

                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                db.Database.EnsureCreated();
                
               
                db.Users.RemoveRange(db.Users);
                db.Posts.RemoveRange(db.Posts);
                db.SaveChanges();
                
                db.Users.AddRange(
                    new ApplicationUser { Id = "William", UserName = "William", Email = "william@test.com", NormalizedUserName = "WILLIAM", NormalizedEmail = "WILLIAM@TEST.COM" },
                    new ApplicationUser { Id = "Pelle", UserName = "Pelle", Email = "pelle@test.com", NormalizedUserName = "PELLE", NormalizedEmail = "PELLE@TEST.COM" }
                );
                db.SaveChanges();
            });
        });
    }

    [Fact]
    public async Task CreatePost_WithValidData_ReturnsCreated()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new
        {
            AuthorId = "William",
            RecipientId = "Pelle",
            Content = "Hej!"
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/posts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();
        response.Headers.Location!.ToString().Should().Contain("/api/posts/");
    }
    [Fact]
    public async Task CreatePost_WithEmptyContent_ReturnsBadRequest()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new
        {
            AuthorId = "William",
            RecipientId = "Pelle",
            Content = ""
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/posts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
    [Fact]
    public async Task CreatePost_WithTooLongContent_ReturnsBadRequest()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new
        {
            AuthorId = "William",
            RecipientId = "Pelle",
            Content = new string('x', 501)  
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/posts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
    
    [Fact]
    public async Task CreatePost_ValidData_PostIsSavedToDatabase()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new
        {
            AuthorId = "William",
            RecipientId = "Pelle",
            Content = "Test meddelande"
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/posts", request);
        var content = await response.Content.ReadAsStringAsync();
        
        // Deserialize to dynamic object
        using var jsonDoc = JsonDocument.Parse(content);
        var root = jsonDoc.RootElement;

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        root.GetProperty("id").GetInt32().Should().BeGreaterThan(0);
        root.GetProperty("authorId").GetString().Should().Be("William");
        root.GetProperty("recipientId").GetString().Should().Be("Pelle");
        root.GetProperty("content").GetString().Should().Be("Test meddelande");
        
        var createdAt = root.GetProperty("createdAt").GetDateTime();
        createdAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }
    [Fact]
    public async Task CreatePost_WithNonExistentAuthorId_ReturnsBadRequest()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new
        {
            AuthorId = "nonexistent-user-id",
            RecipientId = "Pelle",
            Content = "Test message"
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/posts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}

