import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createChatRoom, joinChatRoom } from '@/services/chatService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Index = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [newRoomName, setNewRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create a room",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const roomId = await createChatRoom(newRoomName, currentUser.uid);
      toast({
        title: "Success",
        description: `Chat room created! Room ID: ${roomId}`,
      });
      setNewRoomName('');
      // Here you would typically navigate to the chat room
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to join a room",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsJoining(true);
      const room = await joinChatRoom(joinRoomId);
      toast({
        title: "Success",
        description: "Successfully joined the chat room!",
      });
      setJoinRoomId('');
      // Here you would typically navigate to the chat room
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join chat room",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Chat App</h1>
        
        <div className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Create New Chat
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Create New Chat Room</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="bg-gray-700 text-white"
                  required
                />
                <Button type="submit" disabled={isCreating} className="w-full">
                  {isCreating ? 'Creating...' : 'Create Room'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Join Chat
              </Button>
            </DialogTrigger>
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
        </div>
      </div>
    </div>
  );
};

export default Index;