using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using SteamManagerServer.SteamManager;

var builder = WebApplication.CreateBuilder(args);
var port = args.Length > 0 ? int.Parse(args[0]) : 2174;
builder.Services.AddCors();
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(port, listenOptions =>
    {
        listenOptions.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1;
        listenOptions.UseConnectionLogging();
    });
});


var app = builder.Build();

app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()
);

using var steam = new SteamManager();



app.MapGet("/get-map", async (HttpRequest req) =>
{
    try
    {
        var name = req.Query["name"].ToString();

        if (string.IsNullOrEmpty(name))
            return Results.BadRequest("Query parameter 'name' is required");

        var results = await SteamManager.Search(name);

        var jsonResult = results.Select(item => new
        {
            id = item.Id.ToString(),
            title = item.Title,
            description = item.Description,
            owner = item.Owner.Id.ToString(),
            tags = item.Tags,
            numUpvotes = item.VotesUp,
            numDownvotes = item.VotesDown
        });

        return Results.Json(jsonResult);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapPost("/create", async (HttpRequest req) =>
{
    try
    {
        var data = await req.ReadFromJsonAsync<ReqType>();

        if (string.IsNullOrEmpty(data.Title) ||
            string.IsNullOrEmpty(data.ContentPath) ||
            string.IsNullOrEmpty(data.PreviewPath))
        {
            return Results.BadRequest("Title, ContentPath and PreviewPath are required");
        }

        var fileId = await SteamManager.Upload(
            data.Title,
            data.ContentPath,
            data.PreviewPath,
            data.Description ?? "No description",
            data.ChangeNote ?? "Some changeNote"
        );

        return Results.Json(new { itemId = fileId });
    }
    catch (Exception ex)
    {
        Console.WriteLine("Мда");
        return Results.Problem(ex.Message);
    }
});

app.MapPost("/update", async (HttpRequest req) =>
{
    try
    {
        var data = await req.ReadFromJsonAsync<ReqType>();

        if (!data.ItemId.HasValue ||
            string.IsNullOrEmpty(data.Title) ||
            string.IsNullOrEmpty(data.ContentPath) ||
            string.IsNullOrEmpty(data.PreviewPath))
        {
            return Results.BadRequest("ItemId, Title, ContentPath and PreviewPath are required");
        }

        var fileId = await SteamManager.Upload(
            data.Title,
            data.ContentPath,
            data.PreviewPath,
            data.Description,
            data.ChangeNote ?? "Some changeNote",
            data.ItemId
        );

        return Results.Json(new { itemId = fileId });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

var runTask = app.RunAsync($"http://localhost:{port}");

AppDomain.CurrentDomain.ProcessExit += async (_, __) =>
{
    Console.WriteLine("Stopping server...");
    await app.StopAsync();
};

await runTask;
