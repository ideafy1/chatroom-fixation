import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createChatRoom, joinChatRoom } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import AuthForm from '@/components/AuthForm';
import ChatRoom from '@/components/ChatRoom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { signOut } from '@/services/authService';

const Index = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [newRoomName, setNewRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    if (!newRoomName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room name",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const roomId = await createChatRoom(newRoomName.trim(), currentUser.uid);
      setNewRoomName('');
      setIsDialogOpen(false);
      setCurrentRoomId(roomId);
      toast({
        title: "Success",
        description: "Chat room created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
      setIsDialogOpen(false);
      setCurrentRoomId(joinRoomId.trim());
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Successfully logged out!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!currentUser) {
    return <AuthForm />;
  }

  if (currentRoomId) {
    return <ChatRoom roomId={currentRoomId} onBack={() => setCurrentRoomId(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Welcome to Chat App</h1>
          <Button onClick={handleSignOut} variant="destructive">
            Sign Out
          </Button>
        </div>
        
        <div className="space-y-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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