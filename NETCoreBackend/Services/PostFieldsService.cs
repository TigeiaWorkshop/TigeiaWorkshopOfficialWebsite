using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class PostFieldsService : AbstractService
{
    public PostFieldsService(IServiceProvider theProvider) : base(theProvider)
    {
    }

    private DbSet<PostField> GetCollection()
    {
        return this.GetDatabaseContext().PostFields;
    }

    public async Task<List<PostField>> GetAsync()
    {
        return await this.GetCollection().ToListAsync();
    }

    public async Task<PostField?> GetAsync(int id)
    {
        return await this.GetCollection().FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task CreateAsync(PostField newPostField)
    {
        DatabaseContext dbContext = this.GetDatabaseContext();
        dbContext.PostFields.Add(newPostField);
        await dbContext.SaveChangesAsync();
    }

    public async Task<bool> RemoveAsync(int id)
    {
        PostField? model = await this.GetAsync(id);
        if (model == null)
        {
            return false;
        }

        this.GetCollection().Remove(model);
        await this.SaveChangesAsync();
        return true;
    }
}