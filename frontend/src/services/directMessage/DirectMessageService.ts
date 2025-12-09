import axiosClient from '../axiosClient';
import type { 
  DirectMessageCreateDto, 
  DirectMessageConversationDto,
  InboxMessageDto 
} from '../../types/DirectMessage';

export const directMessageService = {
  /**
   * Send a direct message via REST API
   */
  async sendMessage(receiverId: string, message: string): Promise<void> {
    const dto: DirectMessageCreateDto = {
      receiverId,
      message
    };
    await axiosClient.post('/api/messages', dto);
  },

  /**
   * Get conversation with another user
   */
  async getConversation(otherUserId: string): Promise<DirectMessageConversationDto[]> {
    const response = await axiosClient.get<DirectMessageConversationDto[]>(
      `/api/messages/conversation/${otherUserId}`
    );
    return response.data;
  },

  /**
   * Get inbox (all conversations)
   */
  async getInbox(): Promise<InboxMessageDto[]> {
    const response = await axiosClient.get<InboxMessageDto[]>('/api/messages/inbox');
    return response.data;
  }
};

export default directMessageService;
