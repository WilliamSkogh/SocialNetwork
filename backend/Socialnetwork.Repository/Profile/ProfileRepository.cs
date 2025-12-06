using Microsoft.EntityFrameworkCore;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using SQLitePCL;


namespace Socialnetwork.Repository.Profile;

public class ProfileRepository : IProfileRepository
{
    private readonly ApplicationDbContext _context;

    public ProfileRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<ApplicationUser?> GetUserByUsernameAsync(string userName)
    {
        return await _context.Users
        .FirstOrDefaultAsync(u => u.UserName.ToLower() == userName.ToLower());
    }
    public async Task UpdateUserAsync(ApplicationUser user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}
