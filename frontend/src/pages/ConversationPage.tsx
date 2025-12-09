import { useParams } from 'react-router-dom';
import { useConversation } from '../hooks/useConversation';
import ConversationHeader from '../components/chatcomponents/ConversationHeader';
import MessageList from '../components/chatcomponents/MessageList';
import MessageInput from '../components/chatcomponents/MessageInput';
import { Container, Card } from 'react-bootstrap';

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
    <Container style={{marginTop:'4rem', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card.Header>
          <ConversationHeader
            otherUserName={otherUserDetails.name}
            otherUserProfileImageUrl={otherUserDetails.profileImageUrl}
          />
        </Card.Header>
        <Card.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <MessageList
            messages={messages}
            user={user}
            typingUserId={typingUserId}
            otherUserId={otherUserId}
            otherUserName={otherUserDetails.name}
            otherUserProfileImageUrl={otherUserDetails.profileImageUrl}
            messagesEndRef={messagesEndRef}
          />
        </Card.Body>
        <Card.Footer>
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleTyping={handleTyping}
            handleSendMessage={sendMessage}
            sending={sending}
          />
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ConversationPage;





