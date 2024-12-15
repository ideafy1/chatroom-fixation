import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export const createChatRoom = async (name: string, createdBy: string) => {
  try {
    const chatRoomRef = await addDoc(collection(db, 'chatRooms'), {
      name,
      createdBy,
      createdAt: new Date().toISOString(),
    });
    return chatRoomRef.id;
  } catch (error) {
    console.error('Error creating chat room:', error);
    throw error;
  }
};

export const joinChatRoom = async (roomId: string) => {
  try {
    const roomQuery = query(collection(db, 'chatRooms'), where('__name__', '==', roomId));
    const roomSnapshot = await getDocs(roomQuery);
    
    if (roomSnapshot.empty) {
      throw new Error('Chat room not found');
    }
    
    return roomSnapshot.docs[0].data();
  } catch (error) {
    console.error('Error joining chat room:', error);
    throw error;
  }
};