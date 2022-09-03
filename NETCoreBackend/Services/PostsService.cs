using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class PostsService : AbstractService<Post>
{
    public PostsService(DatabaseContext db) : base(db, db.Posts)
    {
    }

    public async Task<long> CountAsync(int field)
    {
        return await base.CountAsync(x => x.Field.Id == field);
    }

    public async Task<List<Post>> GetAllAsync(int field)
    {
        return await this.GetDatabaseCollection()
            .Where(x => x.Field.Id == field)
            .Include(m => m.Author)
            .ToListAsync();
    }

    public async Task<Post?> GetLatestAsync(int field)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .FirstOrDefaultAsync(x => x.Field.Id == field);
    }

    public new async Task<Post?> GetAsync(int id)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .Include(m => m.Field)
            .Include(m => m.Comments)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public new async Task<bool> CreateAsync(Post newPost)
    {
        DatabaseContext dbContext = this.GetDatabaseContext();

        // setup relationships
        dbContext.PostFields.Attach(newPost.Field);
        EntityEntry<User> authorRef = dbContext.Users.Attach(newPost.Author);
        authorRef.Entity.Posts.Add(newPost);

        return await base.CreateAsync(newPost);
    }
}