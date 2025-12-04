# SocialNetworkDemo

## Database migration and update guide

This section explains how to initialize and update the local database using Entity Framework Core migrations. It covers both new contributors (creating and applying migrations) and coworkers who already have a local database but need to apply new migrations.

### Prerequisites
- .NET 8 SDK installed.
- Ensure the repository is up to date: pull the relevant branch containing migrations.
- `dotnet-ef` and EF Core Tools are available via the project packages (this solution already references `Microsoft.EntityFrameworkCore.Design` and `Microsoft.EntityFrameworkCore.Tools`).
- Confirm your local connection string points to a local database (check `appsettings.Development.json`, user secrets, or environment variables).
- In Visual Studio set environment via __Project Properties__ > __Debug__ > __Environment variables__ (for example `ASPNETCORE_ENVIRONMENT=Development`).

---

### For new contributors (create and apply migrations)
1. Pull the latest code:
2. Restore and build: dotnet restore dotnet build
3. Add a migration (run from solution root):

``dotnet ef migrations add AddYourFeature 
--project ./Socialnetwork.Entityframework/Socialnetwork.Entityframework.csproj 
--startup-project ./SocialNetwork.Api/SocialNetwork.Api.csproj``

- Inspect the generated file in `Socialnetwork.Entityframework/Migrations` and confirm the `Up` method creates or alters the expected tables (for example `CreateTable("Posts")`).

4. Apply the migration to your local DB:
`dotnet ef database update 
--project ./Socialnetwork.Entityframework/Socialnetwork.Entityframework.csproj 
--startup-project ./SocialNetwork.Api/SocialNetwork.Api.csproj`

5. Commit and push the migration files (`Migrations` folder) so coworkers can apply them.

Package Manager Console (Visual Studio alternative):
- Set __Default Project__ to `Socialnetwork.Entityframework` in __Package Manager Console__ and run:
`Add-Migration AddYourFeature -StartupProject SocialNetwork.Api Update-Database -StartupProject SocialNetwork.Api`


to update local DB:
Confirm migrations are present and list them:

`dotnet ef migrations list 
--project ./Socialnetwork.Entityframework/Socialnetwork.Entityframework.csproj 
--startup-project ./SocialNetwork.Api/SocialNetwork.Api.csproj`

- Apply pending migrations: 

`dotnet ef database update 
--project ./Socialnetwork.Entityframework/Socialnetwork.Entityframework.csproj 
--startup-project ./SocialNetwork.Api/SocialNetwork.Api.csproj`