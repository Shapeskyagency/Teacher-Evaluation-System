import { axiosInstanceToken } from "../instence";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const CreateWalkThrough = createAsyncThunk('CreateWalkThrough',async (payload) => {
    const response = await axiosInstanceToken.post(`classroom-walkthrough/create`,payload);
      return response.data;
  })

  export const GetWalkThroughForm = createAsyncThunk('GetWalkThroughForm',async (payload) => {
    const response = await axiosInstanceToken.get(`classroom-walkthrough/get/${payload}`);
      return response.data;
  })

  export const TeacherWalkThroughComplete = createAsyncThunk('TeacherWalkThroughComplete',async (payload) => {
    const response = await axiosInstanceToken.post(`classroom-walkthrough/teacher/${payload.id}`,payload.data);
      return response.data;
  })

  export const GetcreatedBy = createAsyncThunk('GetcreatedBy',async () => {
    const response = await axiosInstanceToken.get(`classroom-walkthrough/get`);
      return response.data;
  })



  
  const classroomWalkthroughSlice = createSlice({
    name: 'classroomWalkthrough',
    initialState: {
      formDataList: null,
      GetForms:null,
      isLoading: false,
      error: null,
      message: '', 
    },
    reducers: {
      resetError: (state) => {
        state.error = null; // Resets the error to null
      },
      resetMessage: (state) => {
        state.message = ''; // Clears the message
      },
    },
    extraReducers: (builder) => {
      builder

        .addCase(GetWalkThroughForm.pending, (state) => {
          state.isLoading = true; // Set loading to true when the request is pending
        })
        .addCase(GetWalkThroughForm.fulfilled, (state, action) => {
          state.isLoading = false; // Set loading to false when the request is fulfilled
          state.formDataList = action.payload; // Store the received form data
        })
        .addCase(GetWalkThroughForm.rejected, (state, action) => {
          state.isLoading = false; // Set loading to false when the request fails
          state.error = action.payload; // Store the error message
        })

        .addCase(GetcreatedBy.pending, (state) => {
          state.isLoading = true; // Set loading to true when the request is pending
        })
        .addCase(GetcreatedBy.fulfilled, (state, action) => {
          state.isLoading = false; // Set loading to false when the request is fulfilled
          state.GetForms = action.payload; // Store the received form data
        })
        .addCase(GetcreatedBy.rejected, (state, action) => {
          state.isLoading = false; // Set loading to false when the request fails
          state.error = action.payload; // Store the error message
        });
    },
  });
  
  export const { resetError, resetMessage } = classroomWalkthroughSlice.actions; // Export the reset actions
  export default classroomWalkthroughSlice.reducer; // Export the reducer
  