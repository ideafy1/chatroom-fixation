import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getChatMessages } from '@/services/chatService';
import { Button } from './ui/button';

interface ChatRoomProps {
  roomId: string;
  onBack: () => void;
}

const ChatRoom = ({ roomId, onBack }: ChatRoomProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const chatMessages = await getChatMessages(roomId);
        setMessages(chatMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [roomId]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Chat Room</h2>
        <Button onClick={onBack} variant="outline">Back</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.userId === currentUser?.uid
                ? 'text-right'
                : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.userId === currentUser?.uid
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;