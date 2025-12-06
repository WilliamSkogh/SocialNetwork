namespace SocialNetwork.Api.DTOs
{

    public class DirectMessageCreateResultDto
    {
        public int Id { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
    }

    public class DirectMessageCreateDto
    {
        public string ReceiverId { get; set; }
        public string Message { get; set; }
    }

    public class DirectMessageConversationDto
    {
        public int Id { get; set; }
        public string SenderId { get; set; }
        public string SenderUsername { get; set; }
        public string ReceiverId { get; set; }
        public string ReceiverUsername { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
    }

    public class InboxMessageDto
    {
        public int Id { get; set; }
        public string SenderId { get; set; }
        public string SenderUsername { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public int UnreadCount { get; set; }
    }
    public class UnreadCountDto
    {
        public int UnreadCount { get; set; }
    }




}
