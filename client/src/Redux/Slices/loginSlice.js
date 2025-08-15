import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginAsync = createAsyncThunk(
  'login/loginAsync',
  async (loginData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', loginData , { withCredentials: true });
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    email: '',
    pswd: '',
    stayConnected: false, // Added stayConnected to initial state
    loading: false,
    error: '',
  },
  reducers: {
    setLoginData: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetForm: (state) => {
      state.email = '';
      state.pswd = '';
      state.stayConnected = false;
      state.loading = false;
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { setLoginData, setError, resetForm } = loginSlice.actions;

export default loginSlice.reducer;
