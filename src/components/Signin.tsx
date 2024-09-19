import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { Button } from "./ui/button";
import { toast, Zoom } from 'react-toastify';


const Signin = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [errormessage,setErrormessage] = useState("")

  const navigate = useNavigate(); 
  const handleSignin = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log(res)
      navigate("/"); 
    } catch (error) {
      if(error instanceof FirebaseError){
        switch(error.code){
          case "auth/invalid-credential":
          setErrormessage("account does not exist")
          break;
        }
      }
      else{
        setErrormessage("Error Occured")
      }
    }
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
          <form onSubmit={handleSignin} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
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
            <Button className="rounded-xl">Sign in</Button>
            
            <div className="mt-1 ms-1">
              <p className="inline-block">Dont Have an account?</p> <Link className="inline-block" to={'/signup'}>Singup</Link>
            </div>
          </form>
        </div>
    </div>
  );
};

export default Signin;