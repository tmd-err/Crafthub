import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  username: '',
  email: '',
  password: '',
  phone: '',
  confirmPassword: '',
  role: 'client',
  errors: {},
  loading: false,
  success: false,
};

// Async thunk for signup
export const signUpAsync = createAsyncThunk(
  'signUp/signUpAsync',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/signup',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Signup failed.' });
    }
  }
);

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setSignUpData: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    setError: (state, action) => {
      state.errors = action.payload;
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.loading = true;
        state.errors = {};
        state.success = false;
      })
      .addCase(signUpAsync.fulfilled, (state) => {
        state.loading = false;
        state.errors = {};
        state.success = true;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.errors = action.payload || { message: 'Signup failed. Please try again.' };
      });
  },
});

export const { setSignUpData, setError, resetForm } = signUpSlice.actions;

export default signUpSlice.reducer;
