interface QuickRepliesProps {
    onQuickReply: (emoji: string) => void;
}

export default function QuickReplies({ onQuickReply }: QuickRepliesProps) {
    const replies = ["🔥","😍","❤️","🏆", "👏", "😠"];

    return (
        <div className="quick-replies">
            {replies.map((reply) => (
                <button 
                    key={reply}
                    onClick={() => onQuickReply(reply)}
                    className="quick-reply-btn"
                    type="button"
                >
                    {reply}
                </button>
            ))}
        </div>
    );
}
