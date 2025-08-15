import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user profile
export const getProfile = createAsyncThunk('profile/getProfile', async (userId, thunkAPI) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/profile/${userId}`);
    console.log(response.data) ;
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Update user password
export const updatePassword = createAsyncThunk(
    'profile/updatePassword',
    async ({ id, currentPassword, newPassword }, thunkAPI) => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/profile/${id}/update-password`,
          { currentPassword, newPassword } // send as an object!
        );
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || 'Server error');
      }
    }
  );
  

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    clearProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.success = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null ;
        state.success = 'Password updated successfully';
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
