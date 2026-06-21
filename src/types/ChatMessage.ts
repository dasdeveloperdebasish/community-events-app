export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  createdAt: string;
  isMine: boolean;
}
