using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Socialnetwork.Repository;
using SocialNetwork.Api.Extensions;
using SocialNetwork.Api.Endpoints;
using SocialNetwork.Entity;
using SocialNetwork.Entityframework;
using SocialNetwork.Repository;
using SocialNetwork.Service;


var builder = WebApplication.CreateBuilder(args);


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "Data Source=../socialnetwork.db";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddScoped<SocialNetwork.Repository.Posts.IPostRepository, SocialNetwork.Repository.Posts.PostRepository>();
builder.Services.AddScoped<SocialNetwork.Service.IPostService, SocialNetwork.Service.PostService>();
builder.Services.AddScoped<IMediaUploadService, MediaUploadService>();

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<ApplicationUser>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddScoped<IDirectMessageRepository, DirectMessageRepository>();
builder.Services.AddScoped<IDirectMessageService, DirectMessageService>();

builder.Services.AddScoped<IFollowRepository, FollowRepository>();
builder.Services.AddScoped<FollowService>();

builder.Services.AddScoped<ILikeService, LikeService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Skriv in din token h�r"
    });


    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors("AllowAll");

app.UseAuthentication(); 
app.UseAuthorization();


app.MapGroup("/auth").MapIdentityApi<ApplicationUser>();

app.MapEndpoints<Program>();

app.Run();

public partial class Program { }