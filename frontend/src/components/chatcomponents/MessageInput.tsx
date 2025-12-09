
import React from 'react';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleTyping: () => void;
  handleSendMessage: (e: React.FormEvent) => void;
  sending: boolean;
}

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleTyping,
  handleSendMessage,
  sending
}: MessageInputProps) => {
  return (
    <form
      onSubmit={handleSendMessage}
      style={{
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #dee2e6',
        display: 'flex',
        gap: '10px',
        flexShrink: 0
      }}
    >
      <input
        type="text"
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
          handleTyping();
        }}
        placeholder="Skriv ett meddelande..."
        disabled={sending}
        style={{
          flex: 1,
          padding: '12px 16px',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          fontSize: '14px',
          outline: 'none'
        }}
        autoFocus
      />
      <button
        type="submit"
        disabled={!newMessage.trim() || sending}
        style={{
          padding: '12px 24px',
          backgroundColor: newMessage.trim() && !sending ? '#0d6efd' : '#dee2e6',
          color: newMessage.trim() && !sending ? 'white' : '#6c757d',
          border: 'none',
          borderRadius: '8px',
          cursor: newMessage.trim() && !sending ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.2s'
        }}
      >
        {sending ? 'Skickar...' : 'Skicka'}
      </button>
    </form>
  );
};

export default MessageInput;
