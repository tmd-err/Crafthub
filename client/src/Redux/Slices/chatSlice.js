// src/features/chat/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import socket from '../../components/Chat/socket';
import axios from 'axios';

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async ({ user1, user2 }, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/history/${user1}/${user2}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch chat history');
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'chat/markMessageAsRead',
  async ({messageId,userId}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/chat/read/${messageId}/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark message as read');
    }
  }
);

export const fetchUnreadConversationsCount = createAsyncThunk(
  'chat/fetchUnreadConversationsCount',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/unread-conversations-count/${userId}`);
      return response.data.unreadConversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/conversations/${userId}`);
      console.log(userId)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  messages: [],
  conversations: [],
  unreadConvCount: 0,
  loadingConversations: false,
  loadingMessages: false,
  loadingUnreadCount: false,
  socketConnected: false,
  socketLoading: true,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    setSocketLoading: (state, action) => {
      state.socketLoading = action.payload;
    },
    addMessage: (state, action) => {
      console.log(action.payload)
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loadingMessages = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loadingMessages = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload;
      })

      .addCase(markMessageAsRead.pending, (state) => {
        state.loadingMessages = true;
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        state.loadingMessages = false;
        const updatedMessage = action.payload;
        const index = state.messages.findIndex(msg => msg._id === updatedMessage._id);
        if (index !== -1) {
          state.messages[index] = updatedMessage;
        }
      })
      .addCase(markMessageAsRead.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload;
      })

      .addCase(fetchUnreadConversationsCount.pending, (state) => {
        state.loadingUnreadCount = true;
        state.error = null;
      })
      .addCase(fetchUnreadConversationsCount.fulfilled, (state, action) => {
        state.loadingUnreadCount = false;
        state.unreadConvCount = action.payload;
      })
      .addCase(fetchUnreadConversationsCount.rejected, (state, action) => {
        state.loadingUnreadCount = false;
        state.error = action.payload;
      })

      .addCase(fetchConversations.pending, (state) => {
        state.loadingConversations = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loadingConversations = false;
        state.conversations = action.payload;
        state.error = null;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload;
      });
  }
});

export const sendMessage = (messageData) => () => {
  socket.emit('sendMessage', messageData);
};

export const { addMessage, setMessages, clearMessages ,setSocketConnected,setSocketLoading } = chatSlice.actions;
export default chatSlice.reducer;
