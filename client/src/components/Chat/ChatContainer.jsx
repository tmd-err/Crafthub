import PropTypes from 'prop-types';  // Import PropTypes for validation
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import useChatListener from '../../hooks/useChatListener';
import { useOutletContext, useParams } from 'react-router-dom';
const ChatContainer = () => {
  useChatListener();
  const {receiverId} = useParams() ; 
  const { senderId } = useOutletContext(); // Get senderId from Outlet context
  return (
    <div className="w-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {receiverId ? (
          <ChatMessages senderId={senderId} receiverId={receiverId} />
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-600">
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
      {receiverId && (
        <div className="p-4">
          <ChatInput senderId={senderId} receiverId={receiverId} />
        </div>
      )}
    </div>
  );
};

// Validate the props
ChatContainer.propTypes = {
  senderId: PropTypes.string.isRequired,    // senderId must be a string
  receiverId: PropTypes.string.isRequired,  // receiverId must be a string
};

export default ChatContainer;
