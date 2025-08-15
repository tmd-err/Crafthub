import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import socket from '../components/Chat/socket';
import { addMessage } from '../Redux/Slices/chatSlice';

const useChatListener = () => {
  const dispatch = useDispatch();
  const isListenerAttached = useRef(false);

  useEffect(() => {
    if (!isListenerAttached.current) {
      socket.on('receiveMessage', (message) => {
        dispatch(addMessage(message));
      });
      isListenerAttached.current = true;
    }

    return () => {
      socket.off('receiveMessage');
      isListenerAttached.current = false;
    };
  }, [dispatch]);
};

export default useChatListener;

