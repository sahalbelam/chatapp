import { useEffect } from "react";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="flex bg-slate-200 justify-center items-center gap-20 ">
      <div className=" bg-white rounded-lg max-w-md w-full">
        <CreateRoom />
      </div>
  
      <div className=" bg-white rounded-lg max-w-md w-full">
        <JoinRoom />
      </div>
    </div>
  );
  
};

export default Lobby;
