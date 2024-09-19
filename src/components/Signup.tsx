import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { Button } from "./ui/button";
import { toast, Zoom } from 'react-toastify';


const Signup = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [displayName,setDisplayName] = useState("")
    const [errormessage,setErrormessage] = useState("")

    const navigate = useNavigate(); 

    const handleSignup = async (e:React.FormEvent) => {
      e.preventDefault();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user

        await updateProfile(user,{
          displayName:displayName
        })
        console.log(user.displayName)
   
        navigate("/"); 
      } catch (error){
       if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrormessage("This email is already registered. Please sign in.");
            break;
          case "auth/invalid-email":
            setErrormessage("Invalid email format. Please check and try again.");
            break;
          case "auth/weak-password":
            setErrormessage("Password should be at least 6 characters long.");
            break;
          default:
            setErrormessage("Something went wrong. Please try again.");
        }
      } else {
        setErrormessage("An unexpected error occurred. Please try again.");
      }}
    };

    useEffect(()=>{
      if(errormessage){
        // toast.error(error)
        toast.error(errormessage, {
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
        setErrormessage("")
      }
    },[errormessage])
    
  return (
  <div className="bg-slate-200">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <form onSubmit={handleSignup} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
            <input
              type="text"
              placeholder="Enter your username"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="email"
              className="border rounded-xl border-gray-300 p-2 mb-4 w-80"
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="border rounded-xl border-gray-300 p-2 mb-4 w-80"
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
              className="border rounded-xl border-gray-300 p-2 mb-4 w-80"
            />
            <Button className="rounded-xl">Sign up</Button>
            {errormessage && 
            <div>
              {errormessage}
            </div>}
            <div className="mt-1 ms-1">
              <p className="inline-block">Already Have an account?</p> <Link className="inline-block" to={'/signin'}>Singin</Link>
            </div>
          </form>
        </div>
    </div>
  );
}

export default Signup;
