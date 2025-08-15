import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from '../../Redux/Slices/chatSlice';
import { Link, Navigate } from 'react-router-dom';


const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const userId = user && user._id ;
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector((state) => state.chat);
  useEffect(() => {
    if (userId) {
      dispatch(fetchConversations(userId));
    }

  }, [dispatch, userId]);
  if (!userId) {
    return <Navigate to="/auth/login" />;
  }

  // Loading and error handling
  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-1/3 max-w-xs bg-white border-r border-gray-200 p-4  h-full overflow-y-auto">
  <h2 className="text-xl font-semibold mb-4 text-center mt-2">Conversations</h2>
  <hr className='border-gray-300' />
  {/* List all conversations */}
  <ul className="space-y-2 flex flex-col mt-5 h-[450px] overflow-x-hidden overflow-y-auto pr-2">

    {conversations.length > 0 ? (
      conversations.map((conversation) => (
        <>
        <Link to ={`/conversations/${conversation.otherUser}`} >
          <li
            key={conversation._id}
            className="p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300 flex items-center space-x-3 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <img
                  width={50}
                  className="rounded-full border-2 border-gray-300"
                  src={conversation.otherUserInfo.profilePicture || '/assets/user.webp'}
                  alt="Profile"
                />
              </div>
              <div className="flex flex-col w-full">
                {/* Sender's Username */}
                <h5 className="font-semibold text-lg text-gray-800 truncate">
                  {conversation.otherUserInfo.username}
                </h5>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  {/* Last Message (truncated) */}
                  <p className="truncate w-full">{conversation.content.length>30 ? conversation.content.slice(0,30)+'...' : conversation.content}</p>
                  <p>{conversation.createdAt}</p>
                </div>
              </div>
            </div>
          </li>
        </Link>
        </>
      ))
    ) : (
      <h6 className="text-center text-gray-500 pt-4">You have no conversations yet!</h6>
    )}
  </ul>
  
</div>

  );
};

export default Sidebar;
