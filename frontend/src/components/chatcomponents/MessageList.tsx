
import React from 'react';
import type { DirectMessageConversationDto } from '../../types/DirectMessage';
import type { User } from '../../AuthContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: DirectMessageConversationDto[];
  user: User;
  typingUserId?: string | null;
  otherUserId?: string;
  otherUserName: string;
  otherUserProfileImageUrl?: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList = ({
  messages,
  user,
  typingUserId,
  otherUserId,
  otherUserName,
  otherUserProfileImageUrl,
  messagesEndRef
}: MessageListProps) => {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      minHeight: 0
    }}>
      {messages.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6c757d'
        }}>
          <p>Inga meddelanden än. Skicka det första meddelandet!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isOwnMessage={msg.senderId === user.id}
            user={user}
          />
        ))
      )}
      {typingUserId === otherUserId && (
        <TypingIndicator 
            otherUserName={otherUserName}
            otherUserProfileImageUrl={otherUserProfileImageUrl}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
