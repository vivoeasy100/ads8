using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using TrabalhoJusto.Api.Data;
using System;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Database Connection from DATABASE_URL env var
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
if (string.IsNullOrEmpty(databaseUrl))
{
    // Fallback to SQLite for zero-config local testing!
    databaseUrl = "sqlite:trabalhojusto.db";
}

if (databaseUrl.StartsWith("sqlite:") || databaseUrl.Contains(".db") || databaseUrl.StartsWith("Data Source="))
{
    var sqlitePath = databaseUrl.Replace("sqlite:", "");
    if (string.IsNullOrEmpty(sqlitePath)) sqlitePath = "trabalhojusto.db";
    var connectionString = $"Data Source={sqlitePath}";
    
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(connectionString));
}
else
{
    var connectionString = ConvertPostgreSqlUrlToConnectionString(databaseUrl);
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString));
}

var app = builder.Build();

// Ensure the database is created and seeded on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
    DbSeeder.Seed(dbContext);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "TrabalhoJusto .NET API Server is running!");

app.Run();

static string ConvertPostgreSqlUrlToConnectionString(string url)
{
    if (string.IsNullOrEmpty(url)) return "";
    
    if (!url.StartsWith("postgres://") && !url.StartsWith("postgresql://"))
    {
        return url; // Assume already in connection string format
    }

    try
    {
        var uri = new Uri(url);
        var userInfo = uri.UserInfo.Split(':');
        var username = Uri.UnescapeDataString(userInfo[0]);
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        var host = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432;
        var database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/'));

        var sslMode = (host == "localhost" || host == "127.0.0.1") ? "Prefer" : "Require";
        return $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode={sslMode};Trust Server Certificate=true;";
    }
    catch (Exception)
    {
        return url;
    }
}
