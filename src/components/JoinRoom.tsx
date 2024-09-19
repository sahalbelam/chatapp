import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast, Zoom } from 'react-toastify';

const JoinRoom = () => {
    const db = getFirestore()
    const [roomid,setRoomid] = useState("")
    const [error,setError] = useState("")
    const navigate = useNavigate()

    const handleJoinRoom = async () =>{
      try{
          if(!roomid.trim()){
            setError("Please enter a Room ID")
            return
          }
          const docRef = doc(db, "rooms", roomid);
          const docsnap = await getDoc(docRef)
          // if(docsnap.exists()){
          //   const docData = docsnap.data()
          //   console.log(docData.ownerid)
          // }
          if(docsnap.exists()){
              navigate(`/rooms/${roomid}`)
          }else{
            setError("room does not exist")
          }
      }catch(err){
        setError("An error occured while joining the room")
      }
    }

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
        <h2 className="text-2xl font-semibold mb-6 text-center">Join a Room</h2>
          <div className="flex flex-col gap-4">
            <Input 
              className="w-full p-2 border border-gray-300 rounded-lg"
              type="text" 
              placeholder="Enter Room id" 
              value={roomid}
              onChange={(e) => setRoomid(e.target.value)} 
            />
            <Button 
              className="w-full text-white p-2 rounded-lg hover:bg-slate-600 transition-colors"
              onClick={handleJoinRoom}
              >
              Join Room
            </Button>          
        </div>
      </div>
    </div>
  )
}

export default JoinRoom
