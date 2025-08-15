import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatHistory, markMessageAsRead } from '../../Redux/Slices/chatSlice';

const ChatMessages = ({ senderId, receiverId }) => {
  const { messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  // Fetch chat history
  useEffect(() => {
    if (senderId && receiverId) {
      dispatch(fetchChatHistory({ user1: senderId, user2: receiverId }));
    }
  }, [senderId, receiverId, dispatch ,messages]);

  // Scroll to bottom when messages are updated
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Mark last message as read when scrolling to bottom
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

      if (atBottom && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (
          lastMessage &&
          lastMessage._id &&
          lastMessage.sender !== senderId &&
          !lastMessage.read
        ) {
          dispatch(markMessageAsRead({ messageId: lastMessage._id, senderId }));
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages, dispatch, senderId]);

  // Helpers
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.sentAt).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
    });
    return groups;
  };

  const grouped = groupMessagesByDate();

  return (
    <div
      id="chat-container"
      ref={chatContainerRef}
      className="h-[55vh] overflow-y-auto p-4 space-y-6"
    >
      {Object.entries(grouped).length === 0 ? (
        <div className="text-center text-gray-500">Start conversation now!</div>
      ) : (
        Object.entries(grouped).map(([dateKey, msgs]) => (
          <div key={dateKey} className="space-y-4">
            <div className="text-center text-sm text-gray-500">{getDateLabel(dateKey)}</div>

            {msgs.map((msg, index) => (
              <div
                key={index}
                className={`relative max-w-xs md:max-w-md px-4 py-2 rounded-lg break-words ${
                  msg.sender === senderId
                    ? 'bg-blue-500 text-white self-end ml-auto'
                    : 'bg-gray-200 text-black self-start mr-auto'
                }`}
              >
                <span>{msg.content}</span>
                <span
                  className={`absolute bottom-1 right-2 text-[11px] ${
                    msg.sender === senderId ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {formatTime(msg.sentAt)}
                </span>
              </div>
            ))}
          </div>
        ))
      )}

      <div ref={chatEndRef} />
    </div>
  );
};

ChatMessages.propTypes = {
  senderId: PropTypes.string.isRequired,
  receiverId: PropTypes.string.isRequired,
};

export default ChatMessages;
