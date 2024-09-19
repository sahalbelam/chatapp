import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  addDoc, collection, serverTimestamp, onSnapshot, query, 
  orderBy, deleteDoc, doc, getDocs, getDoc
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../firebase';

interface ChatInputProps {
  roomId: string;
  userId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ roomId, userId }) => {
  const [message, setMessage] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;

    try {
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        text: message,
        createdAt: serverTimestamp(),
        userId: userId
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };
  
  return (
    <form onSubmit={sendMessage} className="flex items-center p-4 bg-gray-100">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow px-4 py-2 mr-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send
      </button>
    </form>
  );
};

interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [ownerId, setOwnerId] = useState<string>("");
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.displayName ?? '');
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!roomId) return;

    const fetchOwnerIdAndMessages = async () => {
      // Fetch owner ID
      const docRef = doc(db, 'rooms', roomId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        setOwnerId(docData.ownerid);
      } else {
        console.log("No such room!");
        navigate('/');
        return;
      }

      // Fetch messages
      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        setMessages(newMessages);
      });

      return unsubscribe;
    };

    const unsubscribeMessages = fetchOwnerIdAndMessages();
    
    return () => {
      unsubscribeMessages.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [roomId, navigate]);

  const leaveRoom = () => {
    navigate('/');
  };

  const deleteRoom = async () => {
    if (!roomId) return;

    // Check if the current user is the owner
    if (userId !== ownerId) {
      alert("Only the room owner can delete this room.");
      return;
    }

    try {
      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);
      const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      await deleteDoc(doc(db, 'rooms', roomId));

      navigate('/');
    } catch (error) {
      console.error('Error deleting room: ', error);
    }
  };

  if (!roomId) {
    return <div>Invalid room ID</div>;
  }

  return (
    <div className="flex flex-col h-[690px]">
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Room: {roomId}</h1>
        <div>
          <button
            onClick={leaveRoom}
            className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
          >
            Leave Room
          </button>
          {userId === ownerId && (
            <button
              onClick={deleteRoom}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Room
            </button>
          )}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="font-bold">{message.userId}: </span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <ChatInput roomId={roomId} userId={userId} />
    </div>
  );
};

export default ChatRoom;