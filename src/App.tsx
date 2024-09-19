import Signup from "./components/Signup"
import Navbar from "./components/Navbar"
import Signin from "./components/Signin"
import Home from "./components/Home"
import ChatRoom from "./components/ChatRoom"
import { Route, Routes } from "react-router-dom"
import './index.css'
import Lobby from "./components/Lobby"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/rooms/:roomId" element={<ChatRoom />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

