using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public abstract class AbstractService
{
    private readonly IServiceProvider _serviceProvider;

    protected AbstractService(IServiceProvider theProvider)
    {
        this._serviceProvider = theProvider;
    }

    protected DatabaseContext GetDatabaseContext()
    {
        return this._serviceProvider.CreateScope().ServiceProvider.GetRequiredService<DatabaseContext>();
    }

    public async Task SaveChangesAsync()
    {
        await this.GetDatabaseContext().SaveChangesAsync();
    }
}