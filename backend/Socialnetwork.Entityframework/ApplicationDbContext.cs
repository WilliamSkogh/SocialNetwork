using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;

namespace SocialNetwork.Entityframework;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Post> Posts { get; set; }
    public DbSet<DirectMessage> DirectMessages { get; set; }
    public DbSet<Follow> Follows { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Dislike> Dislikes { get; set; }
    public DbSet<Comment> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        
        builder.Entity<DirectMessage>()
            .HasOne(dm => dm.Sender)
            .WithMany()
            .HasForeignKey(dm => dm.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<DirectMessage>()
            .HasOne(dm => dm.Receiver)
            .WithMany()
            .HasForeignKey(dm => dm.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);


        builder.Entity<Follow>()
             .HasKey(f => new { f.FollowerId, f.FollowingId });

        builder.Entity<Follow>()
            .HasOne(f => f.Follower)
            .WithMany(u => u.Following)
            .HasForeignKey(f => f.FollowerId)
            .OnDelete(DeleteBehavior.Restrict);

        
        builder.Entity<Follow>()
            .HasOne(f => f.Following)
            .WithMany(u => u.Followers)
            .HasForeignKey(f => f.FollowingId)
            .OnDelete(DeleteBehavior.Restrict);

        // Like configuration
        builder.Entity<Like>()
            .HasOne(l => l.Post)
            .WithMany(p => p.Likes)
            .HasForeignKey(l => l.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Like>()
            .HasOne(l => l.User)
            .WithMany()
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Dislike configuration
        builder.Entity<Dislike>()
            .HasOne(d => d.Post)
            .WithMany(p => p.Dislikes)
            .HasForeignKey(d => d.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Dislike>()
            .HasOne(d => d.User)
            .WithMany()
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Comment configuration
        builder.Entity<Comment>()
            .HasOne(c => c.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }

}