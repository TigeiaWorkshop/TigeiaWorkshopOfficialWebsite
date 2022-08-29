using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class PostsService : AbstractService
{
    public PostsService(IServiceProvider theProvider) : base(theProvider)
    {
    }

    private DbSet<Post> GetCollection()
    {
        return this.GetDatabaseContext().Posts;
    }

    public async Task<long> CountAsync(int field)
    {
        return await this.GetCollection().LongCountAsync(x => x.Field.Id == field);
    }

    public async Task<List<Post>> GetAllAsync(int field)
    {
        return await this.GetCollection()
            .Where(x => x.Field.Id == field)
            .Include(m => m.Author)
            .Include(m => m.Field)
            .ToListAsync();
    }

    public async Task<Post?> GetLatestAsync(int field)
    {
        return await this.GetCollection()
            .Include(m => m.Author)
            .Include(m => m.Field)
            .FirstOrDefaultAsync(x => x.Field.Id == field);
    }

    public async Task<Post?> GetAsync(int id)
    {
        return await this.GetCollection()
            .Include(m => m.Author)
            .Include(m => m.Field)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<bool> CreateAsync(Post newPost)
    {
        DatabaseContext dbContext = this.GetDatabaseContext();

        User? authorRef = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == newPost.Author.Id);
        if (authorRef == null)
        {
            return false;
        }

        authorRef.Posts.Add(newPost);
        newPost.Author = authorRef;

        PostField? fieldRef = await dbContext.PostFields.FirstOrDefaultAsync(x => x.Id == newPost.Field.Id);
        if (fieldRef == null)
        {
            return false;
        }

        newPost.Field = fieldRef;

        dbContext.Posts.Add(newPost);
        await dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveAsync(int id)
    {
        Post? model = await this.GetAsync(id);
        if (model == null)
        {
            return false;
        }

        this.GetCollection().Remove(model);
        await this.SaveChangesAsync();
        return true;
    }
}