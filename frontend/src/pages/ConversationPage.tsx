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

  if (!user) return null;
  if (loading)
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Laddar konversation...</p>
      </div>
    );

  return (
    <>
      <style type="text/css">
        {`
          .conversation-container {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
          }

          .conversation-card {
            display: flex;
            flex-direction: column;
            height: 90vh;
            max-width: 800px;
            width: 100%;
            border-radius: 10px;
            overflow: hidden;
          }

          .conversation-body {
            flex: 1 1 auto;
            overflow-y: auto;
            background-color: #ffffff;
          }

          @media (max-width: 767.98px) {
            .conversation-card {
              height: 100%;
              max-width: 100%;
              border-radius: 0;
            }
          }
        `}
      </style>

      <Container className="conversation-container">
        <Card className="conversation-card">
          <Card.Header style={{ flexShrink: 0, padding: 0 }}>
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

          <Card.Footer style={{ flexShrink: 0, padding: 0 }}>
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
