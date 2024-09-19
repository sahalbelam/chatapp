import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from "../firebase"; // Import the Firestore instance
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input"
import { toast, Zoom } from 'react-toastify';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("")
  const [ownerid, setOwnerid] = useState<string>("")
  const [error,setError] = useState("")
  const navigate = useNavigate()

    const auth = getAuth();
    useEffect(()=>{
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          // console.log(uid);
          setOwnerid(uid);
        } else{
          navigate('/signin')
        }
      });
      return() => unsubscribe()
    },[])

  const makeRoom = async (roomName: string, ownerid: string) => {
    try {
      const roomRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
        ownerid,              
        createdAt: serverTimestamp() 
      });

      return roomRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };


  const handleCreateRoom = async () => {
    if(!roomName.trim()){
      setError("please enter a room name")
      return
    }
    if(!ownerid){
      setError("it looks loke your logged out, make sure you are logged in")
      return
    }
    try{
      const roomId = await makeRoom(roomName, ownerid);
      // console.log('Created Room ID:', roomId);
      navigate(`/rooms/${roomId}`)
    }catch(error){
      console.error(error)
    }
  };

  useEffect(()=>{
    if(error){
      // toast.error(error)
      toast.error(error, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
      setError("")
    }
  },[error])

  return (
    <div className="bg-slate-200 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create a Room</h2>
          <div className="flex flex-col gap-4">
            <Input 
              className="w-full p-2 border border-gray-300 rounded-lg"
              type="text" 
              placeholder="Enter Room Name" 
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)} 
            />
            
            <Button 
              className="w-full text-white p-2 rounded-lg hover:bg-slate-600 transition-colors"
              onClick={handleCreateRoom}
            >
              Create Room
            </Button>
        </div>
      </div>
    </div>
  )
};

export default CreateRoom