import  { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage, sendMessage } from '../../Redux/slices/chatSlice';
import {FaPaperPlane} from 'react-icons/fa'
import PropTypes from 'prop-types';

const ChatInput = ({ senderId, receiverId }) => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();

  const handleSend = () => {
    if (!content.trim()) return;
    dispatch(addMessage({sender:senderId,receiver:receiverId ,content ,sentAt:new Date()}) );
    dispatch(sendMessage({ senderId, receiverId, content }));
    setContent('');
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        className="border border-gray-300 p-2 outline-0 rounded w-full"
      />
      <button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 rounded">
        <FaPaperPlane/>
      </button>
    </div>
  );
};
ChatInput.propTypes = {
  senderId: PropTypes.string.isRequired,  
  receiverId: PropTypes.string.isRequired,  
};

export default ChatInput;
