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
    <>
      <style type="text/css">
        {`
          .conversation-container {
            padding-top: 2rem;
            padding-bottom: 2rem;
            height: 100%;
          }
          .conversation-card {
            max-width: 800px;
            margin: 0 auto;
            height: 85vh;
            display: flex;
            flex-direction: column;
          }
          .conversation-body {
            flex-grow: 1;
            overflow-y: auto;
          }

          @media (max-width: 767.98px) {
            .conversation-container {
              padding: 0;
            }
            .conversation-card {
              max-width: none;
              height: 100%;
              border: none;
              border-radius: 0;
            }
          }
        `}
      </style>
      <Container className="conversation-container">
        <Card className="conversation-card">
          <Card.Header>
            <ConversationHeader
              otherUserName={otherUserDetails.name}
              otherUserProfileImageUrl={otherUserDetails.profileImageUrl}
            />
          </Card.Header>
          <Card.Body className="conversation-body">
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
    </>
  );
};

export default ConversationPage;





