import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  doc,
  getDoc,
  serverTimestamp,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

export const createChatRoom = async (name: string, createdBy: string) => {
  try {
    const chatRoomData = {
      name,
      createdBy,
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: null
    };

    const chatRoomRef = await addDoc(collection(db, 'chatRooms'), chatRoomData);
    return chatRoomRef.id;
  } catch (error: any) {
    console.error('Error creating chat room:', error);
    throw new Error('Failed to create chat room');
  }
};

export const joinChatRoom = async (roomId: string) => {
  try {
    const roomRef = doc(db, 'chatRooms', roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      throw new Error('Chat room not found');
    }
    
    return { id: roomSnap.id, ...roomSnap.data() };
  } catch (error: any) {
    console.error('Error joining chat room:', error);
    throw new Error('Failed to join chat room');
  }
};

export const getChatMessages = async (roomId: string) => {
  try {
    const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error: any) {
    console.error('Error getting messages:', error);
    throw new Error('Failed to load messages');
  }
};

export const sendMessage = async (roomId: string, userId: string, text: string) => {
  try {
    const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
    await addDoc(messagesRef, {
      text,
      userId,
      createdAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
};