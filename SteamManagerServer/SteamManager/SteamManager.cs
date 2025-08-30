using Steamworks;
using Steamworks.Data;
using Steamworks.Ugc;



public class SteamManager : IDisposable
{
    private readonly uint appId = 2330500;

    public SteamManager()
    {
        Init(appId);
    }

    private static void Init(uint appId)
    {
        SteamClient.Init(appId);
    }

    public static async Task<List<Item>> Search(string name)
    {
        var userItems = Query.Items
            .WhereUserPublished()
            .WithTag("CustomMaps");

        var total = new List<Item>();
        var result = await userItems.GetPageAsync(1);

        foreach (Item entry in result.Value.Entries)
        {
            if (entry.Title.Contains(name, StringComparison.OrdinalIgnoreCase))
            {
                total.Add(entry);
            }
        }

        return total;
    }

    public async Task<ulong> Upload(
        string title, 
        string contentPath, 
        string previewPath, 
        string description = "No description", 
        string changeNote = "Some changeNote", 
        ulong? itemId = null
    )
    {
        Editor workshopItem;

        if (itemId.HasValue)
        {
            workshopItem = new Editor((PublishedFileId)itemId)
                .WithChangeLog(changeNote);
        }
        else
        {
            workshopItem = Editor.NewCommunityFile
                .WithDescription(description);
        }

        workshopItem
            .WithTitle(title)
            .WithContent(contentPath)
            .WithPreviewFile(previewPath);

        var result = await workshopItem.SubmitAsync();

        return result.FileId;
    }

    public void Dispose()
    {
        SteamClient.Shutdown();
    }
}
