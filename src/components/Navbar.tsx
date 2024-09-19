import { Link } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";

const Navbar = () => {
    const [userstatus,setUserstatus] = useState(false)
    useEffect(()=>{
        const live = onAuthStateChanged(auth, (user) => {
            setUserstatus(!!user)
        });
        return()=>live()
    },[auth])

    const signout = ()=>{
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("you have been logged out")
          }).catch((error) => {
            console.error(error)
        });
    }
  return (
    <div className="bg-gray-800 text-white p-1 h-15" >
      <ul className="flex p-2 ms-7 justify-start items-center gap-10">
        <Link to={'/'} > <li>Home</li></Link>
        <Link to={'/lobby'} > <li>Lobby</li></Link>
       {userstatus?(<Button onClick={signout}>Signout</Button>):(<Link to={'/signin'}> Signin </Link>)}
      </ul>
    </div>
  )
}

export default Navbar
