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
  orderBy
} from 'firebase/firestore';

export const createChatRoom = async (name: string, createdBy: string) => {
  try {
    const chatRoomRef = await addDoc(collection(db, 'chatRooms'), {
      name,
      createdBy,
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: null
    });
    return chatRoomRef.id;
  } catch (error: any) {
    throw new Error(error.message);
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
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
};