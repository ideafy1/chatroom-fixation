import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { joinChatRoom } from '@/services/chatService';

interface JoinChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomJoined: (roomId: string) => void;
}

const JoinChatDialog = ({ isOpen, onOpenChange, onRoomJoined }: JoinChatDialogProps) => {
  const [joinRoomId, setJoinRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinRoomId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsJoining(true);
      await joinChatRoom(joinRoomId.trim());
      setJoinRoomId('');
      onOpenChange(false);
      onRoomJoined(joinRoomId.trim());
      toast({
        title: "Success",
        description: "Successfully joined the chat room!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Join Existing Chat Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter room ID"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            className="bg-gray-700 text-white"
            required
          />
          <Button type="submit" disabled={isJoining} className="w-full">
            {isJoining ? 'Joining...' : 'Join Room'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinChatDialog;