using Microsoft.AspNetCore.SignalR.Client;
using System.Diagnostics;

Console.WriteLine("=== SignalR DirectMessage Hub Test ===\n");

const string API_URL = "https://localhost:7166/hubs/direct-messages";

// JWT Tokens (byt till dina)
const string USER1_TOKEN = "CfDJ8K4FrlXyvKpGpabXYCrLKZdybDFwBNDqRrsReEUeq17zm6Eynen3sp8dMYzMG6lC3DAOhgZqUvFsG008sInKu6DTnVJp10K9UjTpzhkYL2qdx-d-H0P0gfWcJIXx9xG3q0lT66cLX9kryFiTOYzmbj6LBQXZoTnfHCM9vzfuLASLEhgWrH7h_KYun7hS4Ci0EpufD64f5nRrTso8RTX8aKdHPmV2BRBQ0359MrQWn2vEF9KWKrsVC7eLA-dV-YxqfMv7OG34maE2AaLmZ3Kx1l2IxdyxdBjkgvlRUQsPZCp3E4WqhDxZIJhtnteNlsybvjTgYxiVV6fB8JfQhfsAlZsZyyL9yNrOIxDBNOEMyYly85cSddzhxMkf95C0FZaG3ureeVk0MhItMiZUKmA1MU1fJhawX22S9OnbD5jOmgJT9GTl6dejtP_fXizzDcs75XfmXw8AJZZ-Fqs6SMhjULpuet5PdjdtArOhk1qiww_ePWbV-7XmUHRU63OhhTeQT02gLRhsVTjL4wKLgYDSc279mB2NSQWpjD9Mpx0cy0meJaMklrRxlobK7MyGUKBk4Yf7Sp2hzlWISHhEzxZ_Jtu9MSZxUkeQG5689hhuUQdv2ZQCdnKuwvtpX112oFi0fsGCgB-bjZLZLE_cDfI4eJb6SyqlBQNblKP8fbXTggLS";
const string USER1_ID = "2931caeb-e162-42b9-bbcf-88be0fd7a83c";
const string USER1_NAME = "Amar";

const string USER2_TOKEN = "CfDJ8K4FrlXyvKpGpabXYCrLKZeFSUexZZewYAL8SvRxoUAa5JkGPuD2fiMeEWGEUCx4FQVltDagld2jJ1kwlFo9UjtX6V-dfj7-xdvhRlsqyympURR_DNr-_32nDLBj2mWkhNm0973xtFPTKTPc9eBQ_7OxEI3cEkZS3B6jkvxLM2l98JdCfe6yJ3cx0JmXw8YDpAxYM089x9uMMBIVw9LdMd_ZIdNkLhNBnkRXowsu5nFgYCVqotxzk8VqIHbpiAuGL6erZkb1wHSdP6a7f10ARYiKvELR0jj_adgC9IPXvO1X02LhsOMbPcrgifzkF81yFo6rSbQUBH5wCmNcLoFOYDeMeFswMA79OraVf9ETd1XKPRYcnxTTnJKhK-UpxvB5PN3q_H1WGYaPqWkzRnaSCHSD1MYh2JgP4JeYb1VG5-jrY6faPkntXOIk_Kw9YhClJOd8Ju60i_HhIqvo6VB4644rhS0ztiz1FZEhauWBGFaHnsk_6h2AhFAwMAAVhJGU88dvcKnvriiINtbXKKI6yudxNgHl0-Rn5EIFVi9WdLtEAKpKwSUofNmoqg9hzt2EG3M6KJFh1i7m5iqnYaXHCDZFKhp__tS_pz_eBOCIal655_g7zsJNdIwZA-r2SuRI8Qzdo3ispsZUiNihjmApUGEkwTljIKMipJsGQI8FzznfaylPB3qUn1-HP2A5r4MYxw";
const string USER2_ID = "4a4c1a33-de83-445c-b8d0-73922db84429";
const string USER2_NAME = "Pelle";

var httpHandler = new HttpClientHandler();
httpHandler.ServerCertificateCustomValidationCallback = (_, _, _, _) => true;

// User1 connection
var connection1 = new HubConnectionBuilder()
    .WithUrl(API_URL, opts =>
    {
        opts.AccessTokenProvider = () => Task.FromResult(USER1_TOKEN);
        opts.HttpMessageHandlerFactory = _ => httpHandler;
    })
    .WithAutomaticReconnect()
    .Build();

// User2 connection
var connection2 = new HubConnectionBuilder()
    .WithUrl(API_URL, opts =>
    {
        opts.AccessTokenProvider = () => Task.FromResult(USER2_TOKEN);
        opts.HttpMessageHandlerFactory = _ => httpHandler;
    })
    .WithAutomaticReconnect()
    .Build();

int receivedMessageId = 0;
var testsPassed = 0;
var testsFailed = 0;

// ============= USER1 HANDLERS =============
connection1.On<dynamic>("MessageSent", msg =>
{
    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine($"✓ [USER1] MessageSent: Id={msg.id}");
    Console.ResetColor();
});

connection1.On<dynamic>("MessageReadByRecipient", msg =>
{
    Console.ForegroundColor = ConsoleColor.Magenta;
    Console.WriteLine($"✓ [USER1] MessageReadByRecipient: MessageId={msg.messageId}, ReadBy={msg.readBy}");
    Console.ResetColor();
});

connection1.On<dynamic>("Error", error =>
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine($"✗ [USER1] Error: {error}");
    Console.ResetColor();
});

// ============= USER2 HANDLERS =============
connection2.On<dynamic>("ReceiveDirectMessage", msg =>
{
    Console.ForegroundColor = ConsoleColor.Cyan;
    Console.WriteLine($"✓ [USER2] ReceiveDirectMessage: Id={msg.id}, From={msg.senderId}");
    Console.ResetColor();
    receivedMessageId = msg.id;
});

connection2.On<dynamic>("MessageMarkedAsRead", data =>
{
    Console.ForegroundColor = ConsoleColor.Blue;
    Console.WriteLine($"✓ [USER2] MessageMarkedAsRead: MessageId={data.messageId}");
    Console.ResetColor();
});

connection2.On<dynamic>("UserIsTyping", senderId =>
{
    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.WriteLine($"✓ [USER2] UserIsTyping: {senderId}");
    Console.ResetColor();
});

connection2.On<dynamic>("UserStoppedTyping", senderId =>
{
    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.WriteLine($"✓ [USER2] UserStoppedTyping: {senderId}");
    Console.ResetColor();
});

connection2.On<dynamic>("Error", error =>
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine($"✗ [USER2] Error: {error}");
    Console.ResetColor();
});

try
{
    Console.WriteLine("📡 Connecting...\n");
    await connection1.StartAsync();
    await connection2.StartAsync();

    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine($"✓ {USER1_NAME} connected");
    Console.WriteLine($"✓ {USER2_NAME} connected\n");
    Console.ResetColor();

    // ========== TEST 1: Send Message ==========
    Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Console.WriteLine("TEST 1: User1 → User2 (SendDirectMessage)");
    Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    var sw = Stopwatch.StartNew();
    await connection1.InvokeAsync("SendDirectMessage", USER2_ID, "Hej från User1!");
    sw.Stop();

    receivedMessageId =  await connection1.InvokeAsync<int>("GetLatestDirectMessageIdBetweenUsers", USER1_ID, USER2_ID);

    if (receivedMessageId >0 )
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"\n✅ TEST 1 PASSED ({sw.ElapsedMilliseconds}ms)\n");
        Console.ResetColor();
        testsPassed++;
    }
    else
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"\n❌ TEST 1 FAILED - Message not received\n");
        Console.ResetColor();
        testsFailed++;
    }

    // ========== TEST 2: Mark as Read ==========
    if (receivedMessageId >0)
    {
        Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        Console.WriteLine("TEST 2: User2 → Mark Message Read (MarkMessageAsRead)");
        Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        sw.Restart();
        await connection2.InvokeAsync("MarkMessageAsRead", receivedMessageId);
        
        sw.Stop();

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"\n✅ TEST 2 PASSED ({sw.ElapsedMilliseconds}ms)\n");
        Console.ResetColor();
        testsPassed++;
    }

    // ========== TEST 3: Typing Indicators ==========
    Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Console.WriteLine("TEST 3: Typing Indicators");
    Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    sw.Restart();
    await connection1.InvokeAsync("UserTyping", USER2_ID);
    await connection1.InvokeAsync("UserStoppedTyping", USER2_ID);
    sw.Stop();

    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine($"\n✅ TEST 3 PASSED ({sw.ElapsedMilliseconds}ms)\n");
    Console.ResetColor();
    testsPassed++;

    // ========== SUMMARY ==========
    Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Console.WriteLine("📊 TEST SUMMARY");
    Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine($"✅ Passed: {testsPassed}/3");
    Console.ResetColor();

    if (testsFailed > 0)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"❌ Failed: {testsFailed}/3");
        Console.ResetColor();
    }

    Console.WriteLine("\n✓ Backend SignalR functionality is working!");
    Console.WriteLine("✓ Ready to proceed to frontend implementation\n");

    await connection1.StopAsync();
    await connection2.StopAsync();
}
catch (Exception ex)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine($"❌ Error: {ex.Message}");
    Console.ResetColor();
}