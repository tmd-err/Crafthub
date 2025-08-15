import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch reservations for a user
export const fetchReservations = createAsyncThunk(
  'reservation/fetchReservations',
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reservation/get-reservations/${userId}`);
      return res.data || []; // Return only the array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch reservations');
    }
  }
);

// Delete a reservation
export const deleteReservation = createAsyncThunk(
  'reservation/deleteReservation',
  async (reservationId, thunkAPI) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/reservation/delete-reservation/${reservationId}`);
      return reservationId; // Return the ID of the deleted reservation to remove it from state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete reservation');
    }
  }
);
// Inside reservationSlice.js
export const addReservation = createAsyncThunk(
  'reservation/addReservation',
  async (reservationData, thunkAPI) => {
    try {
      const res = await axios.post('http://localhost:5000/api/reservation/reserve-service', reservationData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to reserve service');
    }
  }
);

export const fetchArtisanReservations = createAsyncThunk(
  'reservation/fetchArtisanReservations',
  async (artisanId, thunkAPI) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reservation/get-artisan-reservations/${artisanId}`);
      return res.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch artisan reservations');
    }
  }
);

export const updateReservationStatus = createAsyncThunk(
  'reservation/updateReservationStatus',
  async ({ id, status }) => {
    const response = await axios.put(`http://localhost:5000/api/reservation/update-reservation-status/${id}`, { status });
    return response.data;
  }
);

const reservationSlice = createSlice({
  name: 'reservation',
  initialState: {
    clientReservations: [],
    artisanReservations: [],
    reservationsCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.clientReservations = action.payload.reservations || [];
        state.reservationsCount = state.clientReservations.length;
      })      
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle the deletion of a reservation
      .addCase(deleteReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.loading = false;
                // Remove from clientReservations if it exists
          state.clientReservations = state.clientReservations.filter(
            (reservation) => reservation._id !== action.payload
          );

          // Remove from artisanReservations if it exists
          state.artisanReservations = state.artisanReservations.filter(
            (reservation) => reservation._id !== action.payload
          );
        state.count = state.count > 0 ? state.count - 1 : 0;
      })
      .addCase(deleteReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
      })
      .addCase(addReservation.fulfilled, (state, action) => {
        state.clientReservations.push(action.payload.reservation); // Assuming response includes the new reservation
        state.count = state.count + 1;
      })
      .addCase(addReservation.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchArtisanReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtisanReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.artisanReservations = action.payload.reservations || [];
        state.reservationsCount = action.payload.count;
      })
      .addCase(fetchArtisanReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      
      
  },
});

export default reservationSlice.reducer