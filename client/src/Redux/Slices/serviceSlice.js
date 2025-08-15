import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for services
const initialState = {
  services: [],
  artisanServices : [] , 
  artisanServicesCount : null ,
  artisanServicesLoading : false ,
  artisans :[] ,
  loading: false,
  error: '',
  success : '' ,
  serviceToFind: null,  // Added to store the found service
};

// Async thunk to fetch services
// Async thunk to fetch services
export const fetchServicesAsync = createAsyncThunk(
  'services/fetchServicesAsync',
  async (_, { getState, rejectWithValue }) => {
    const { services } = getState().service;
    const start = services.length;
    const limit = 9;

    try {
      const response = await axios.get(`http://localhost:5000/api/services?start=${start}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const refetchAllServices = createAsyncThunk(
  'services/refetchAllServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/services?start=0&limit=9`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk to add a service
export const addServiceAsync = createAsyncThunk(
  'services/addServiceAsync',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/create/service', serviceData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update a service
export const updateServiceAsync = createAsyncThunk(
  'services/updateService',
  async ({ serviceId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/update-service/${serviceId}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update service');
    }
  }
);
export const fetchArtisanServices = createAsyncThunk(
  'artisanService/fetchArtisanServices',
  async (artisanId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/get-artisan-services/${artisanId}`);
    return response.data;  // The array of services
  } catch (err) {
    return  (err.response?.data || 'Failed to fetch artisan services');
  }
 }
);
// Async thunk to delete a service
export const deleteServiceAsync = createAsyncThunk(
  'services/deleteServiceAsync',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/delete/service/${serviceId}`);
      return response ;  // Returning the id of the deleted service
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to find a service by its ID
export const findServiceAsync = createAsyncThunk(
  'services/findServiceAsync',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get-service/${serviceId}`);
      return response.data;  // Returning the found service
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refetchAllServices.fulfilled, (state, action) => {
        const { services, artisans, hasMore } = action.payload;
        state.loading = false;
        state.services = services; // Replace with fresh ones
        state.artisans = artisans;
        state.hasMore = hasMore;
      })    
      .addCase(fetchServicesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServicesAsync.fulfilled, (state, action) => {
        const { services, artisans, hasMore } = action.payload;
        state.loading = false;
        state.services = [...state.services, ...services];
        state.artisans = artisans;
        state.hasMore = hasMore;
      })
      
      .addCase(fetchServicesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      // Add service
      .addCase(addServiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;  // Reset success message on new request
      })
      .addCase(addServiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success || 'Service added successfully'; // Assuming success message comes in payload
        state.services.push(action.payload);
        state.artisanServicesCount =state.artisanServicesCount+1 ;
      })
      .addCase(addServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = null;
      })

      // Update service
      .addCase(updateServiceAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateServiceAsync.fulfilled, (state, action) => {
        const updatedService = action.payload;
        const index = state.services.findIndex(service => service._id === updatedService._id);
        if (index !== -1) {
          state.services[index] = updatedService;
        }
      })
      .addCase(updateServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update service';
      })
      
      // Delete service
      .addCase(deleteServiceAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteServiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        const idToDelete = action.payload.serviceId;
        state.artisanServices = state.artisanServices.filter(service => service._id !== idToDelete);
        state.artisanServicesCount =state.artisanServicesCount-1 || 0;

      })     
      .addCase(deleteServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete service';
      })
      
      // Find service
      .addCase(findServiceAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(findServiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceToFind = action.payload;  // Store the found service
        state.error = '';
      })
      .addCase(findServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to find service';
      })
      .addCase(fetchArtisanServices.pending, (state) => {
        state.artisanServicesLoading = true;
      })
      .addCase(fetchArtisanServices.fulfilled, (state, action) => {
        state.loading = false;
        state.artisanServices = action.payload.services;
        state.artisanServicesCount = action.payload.count ;
        state.artisanServicesLoading = false ;
      })
      .addCase(fetchArtisanServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default serviceSlice.reducer;
