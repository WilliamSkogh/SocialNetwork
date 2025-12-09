using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Entity
{
    public class DirectMessage
    {
        public int Id { get; set; }
        public required string SenderId { get; set; }
        public required string ReceiverId { get; set; }
        public required string Message { get; set; }
        public DateTime Timestamp { get; set; } = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time"));
        public Post? Post { get; set; }
        public DateTime? ReadAt { get; set; } 
        public bool IsRead { get; set; } = false;

        [NotMapped]
        public int UnreadCount { get; set; }


        public ApplicationUser? Sender { get; set; }
        public ApplicationUser? Receiver { get; set; }

    }
}
