import {  Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Chat/Siderbar';
const Chat = () => {
  const user = JSON.parse(localStorage.getItem('user')) || null;

  if (!user) {
    // Redirect user to login page or show a message
    return <Navigate to="/auth/login" />;
  }

  const userId = user._id; 

  return (
    <div className="flex h-full">
      {/* Sidebar for conversations */}
      <Sidebar />

       {/* Chat container for messages and input */}
       <div className="w-2/3 p-4 flex flex-col">
        <Outlet context={{ senderId: userId }} />
      </div>
    </div>
  );
};

export default Chat;
