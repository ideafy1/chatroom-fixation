import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/AuthForm';
import ChatRoom from '@/components/ChatRoom';
import CreateChatDialog from '@/components/CreateChatDialog';
import JoinChatDialog from '@/components/JoinChatDialog';
import { signOut } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

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
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Create New Chat
          </Button>

          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => setIsJoinDialogOpen(true)}
          >
            Join Chat
          </Button>
        </div>
      </div>

      <CreateChatDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        userId={currentUser.uid}
        onRoomCreated={setCurrentRoomId}
      />

      <JoinChatDialog
        isOpen={isJoinDialogOpen}
        onOpenChange={setIsJoinDialogOpen}
        onRoomJoined={setCurrentRoomId}
      />
    </div>
  );
};

export default Index;