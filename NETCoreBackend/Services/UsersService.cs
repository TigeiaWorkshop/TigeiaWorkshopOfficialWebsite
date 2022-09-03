using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class UsersService : AbstractService<User>
{
    public UsersService(DatabaseContext db) : base(db, db.Users)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await this.GetByExpressionAsync(x => x.Email == email);
    }
}