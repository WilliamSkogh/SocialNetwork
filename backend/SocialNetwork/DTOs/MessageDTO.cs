namespace SocialNetwork.Api.DTOs
{
    public class DirectMessageDto
    {
        public int Id { get; set; }
        public string SenderId { get; set; }
        public string SenderUsername { get; set; }
        public string ReceiverId { get; set; }
        public string ReceiverUsername { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
        public int UnreadCount { get; set; }
    }

    public class DirectMessageCreateDto
    {
        public string ReceiverId { get; set; }
        public string Message { get; set; }
    }




}
