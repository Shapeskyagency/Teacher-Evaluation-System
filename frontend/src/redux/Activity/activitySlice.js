import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceToken } from "../instence"; // Tumhara custom axios instance

// ** Thunk to fetch activities **
export const getRecentActivities = createAsyncThunk(
  "activity/getRecentActivities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceToken.get("/activity/recent-activities");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    activities: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetActivityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecentActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(getRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetActivityError } = activitySlice.actions;
export default activitySlice.reducer;
