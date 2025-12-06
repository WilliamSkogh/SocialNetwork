From the `backend` folder, run:

`dotnet ef migrations list --project .\Socialnetwork.Entityframework\Socialnetwork.Entityframework.csproj --startup-project .\SocialNetwork\SocialNetwork.Api.csproj`

update database: 

`dotnet ef database update --project .\Socialnetwork.Entityframework\Socialnetwork.Entityframework.csproj --startup-project .\SocialNetwork\SocialNetwork.Api.csproj` 


If you need to add migrations after making changes to the models, run:
`dotnet ef migrations add <MigrationName> --project .\Socialnetwork.Entityframework\Socialnetwork.Entityframework.csproj --startup-project .\SocialNetwork\SocialNetwork.Api.csproj`




if you get an error like
SQLite Error 1: 'table "AspNetRoles" already exists' after a teammate has reset migrations,

`dotnet ef database drop --project .\Socialnetwork.Entityframework\Socialnetwork.Entityframework.csproj --startup-project .\SocialNetwork\SocialNetwork.Api.csproj --force`

`dotnet ef database update --project .\Socialnetwork.Entityframework\Socialnetwork.Entityframework.csproj --startup-project .\SocialNetwork\SocialNetwork.Api.csproj`
