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

    public static async Task<ulong> Upload(
        string title, 
        string contentPath, 
        string previewPath, 
        string description = "No description", 
        string changeNote = "Some changeNote", 
        ulong? itemId = null
    )
    {
        var progress = new Progress<float>(p =>
        {
            Console.WriteLine($"Upload progress: {p * 100:F0}%");
        });

        if (itemId.HasValue)
        {
            var workshopItem = await new Editor((PublishedFileId)itemId)
                .WithTitle(title)
                .WithChangeLog(changeNote)
                .WithContent(contentPath)
                .WithPreviewFile(previewPath)
                .SubmitAsync(progress);

            return workshopItem.FileId;
        }
        else
        {
            var workshopItem = await Editor.NewCommunityFile
                .WithTitle(title)
                .WithDescription(description)
                .WithContent(contentPath)
                .WithPreviewFile(previewPath)
                .WithTag("CustomMaps")
                .SubmitAsync(progress);

            return workshopItem.FileId;
        }
    }

    public void Dispose()
    {
        SteamClient.Shutdown();
    }
}
