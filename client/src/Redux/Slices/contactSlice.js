import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const submitContactForm = createAsyncThunk(
  "contact/submitContactForm",
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/contact", contactData); 
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

const initialState = {
  name: "",
  email: "",
  message: "",
  error: "",
  loading: false,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setContactData: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetForm: (state) => {
      state.name = "";
      state.email = "";
      state.message = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred.";
      });
  },
});

export const { setContactData, setError, resetForm } = contactSlice.actions;

export default contactSlice.reducer;
