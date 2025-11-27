using System.Reflection;
using SocialNetwork.Api.Abstractions;

namespace SocialNetwork.Api.Extensions;

public static class EndpointExtensions
{
    public static void MapEndpoints<T>(this IEndpointRouteBuilder app)
    {
        MapEndpoints(app, typeof(T));
    }

    public static void MapEndpoints(this IEndpointRouteBuilder app, Type typeMarker)
    {
        var endpointTypes = GetEndpointTypesFromAssemblyContaining(typeMarker);

        foreach (var endpointType in endpointTypes)
        {
            if (endpointType.GetMethod(nameof(IEndpoint.MapEndpoint)) is MethodInfo methodInfo)
            {
                methodInfo.Invoke(null, new object[] { app });
            }
        }
    }

    private static IEnumerable<TypeInfo> GetEndpointTypesFromAssemblyContaining(Type typeMarker)
    {
        var endpointTypes = typeMarker.Assembly.DefinedTypes
            .Where(x => !x.IsAbstract &&
                        !x.IsInterface &&
                        typeof(IEndpoint).IsAssignableFrom(x));

        return endpointTypes;
    }
}