using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;

namespace SocialNetwork.Entityframework;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }
    public DbSet<DirectMessage> DirectMessages { get; set; }

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
    }
}