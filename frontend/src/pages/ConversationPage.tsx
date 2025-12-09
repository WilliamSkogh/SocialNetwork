import { useParams } from 'react-router-dom';
import { useConversation } from '../hooks/useConversation';
import ConversationHeader from '../components/chatcomponents/ConversationHeader';
import MessageList from '../components/chatcomponents/MessageList';
import MessageInput from '../components/chatcomponents/MessageInput';

const ConversationPage = () => {
  const { userId: otherUserId } = useParams<{ userId: string }>();
  
  const {
    user,
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    typingUserId,
    messagesEndRef,
    sendMessage,
    handleTyping,
    otherUserDetails,
  } = useConversation(otherUserId);

  if (!user) {
    return null; // Or a redirect, which is handled in the hook
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Laddar konversation...</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '1000px',
      margin: '0 auto',
      paddingTop: '60px'
    }}>
      <ConversationHeader
        otherUserName={otherUserDetails.name}
        otherUserProfileImageUrl={otherUserDetails.profileImageUrl}
      />

      <MessageList
        messages={messages}
        user={user}
        typingUserId={typingUserId}
        otherUserId={otherUserId}
        otherUserName={otherUserDetails.name}
        otherUserProfileImageUrl={otherUserDetails.profileImageUrl}
        messagesEndRef={messagesEndRef}
      />

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleTyping={handleTyping}
        handleSendMessage={sendMessage}
        sending={sending}
      />
    </div>
  );
};

export default ConversationPage;





