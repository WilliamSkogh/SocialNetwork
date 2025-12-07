interface QuickRepliesProps {
    onQuickReply: (text: string) => void;
}

export default function QuickReplies({ onQuickReply }: QuickRepliesProps) {
    const replies = ["Cringe", "L + ratio", "Bror vad sysslar du med?"];

    return (
        <div className="quick-replies">
            {replies.map((reply) => (
                <button 
                    key={reply}
                    onClick={() => onQuickReply(reply)}
                    className="quick-reply-btn"
                >
                    {reply}
                </button>
            ))}
        </div>
    );
}
