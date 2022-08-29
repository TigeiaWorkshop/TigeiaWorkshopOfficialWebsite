using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class UsersService : AbstractService
{
    public UsersService(IServiceProvider theProvider) : base(theProvider)
    {
    }

    private DbSet<User> GetCollection()
    {
        return this.GetDatabaseContext().Users;
    }

    public async Task<User?> GetAsync(int id)
    {
        return await this.GetCollection().FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await this.GetCollection().FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task CreateAsync(User newUser)
    {
        DatabaseContext dbContext = this.GetDatabaseContext();
        dbContext.Users.Add(newUser);
        await dbContext.SaveChangesAsync();
    }

    public async Task<bool> RemoveAsync(int id)
    {
        User? model = await this.GetAsync(id);
        if (model == null)
        {
            return false;
        }

        DatabaseContext dbContext = this.GetDatabaseContext();
        dbContext.Users.Remove(model);
        await dbContext.SaveChangesAsync();

        return true;
    }
}