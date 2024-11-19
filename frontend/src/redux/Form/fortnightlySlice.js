import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstanceToken } from "../instence";

export const GetObserverPendignForms = createAsyncThunk('GetObserverPendignForms',async (payload) => {
    const response = await axiosInstanceToken.get(`form/fortnightly-monitor/observer/${payload}`);
      return response.data;
  });


  export const CreateFormOne = createAsyncThunk('CreateFormOne',async (payload) => {
    const response = await axiosInstanceToken.post(`form/fortnightly-monitor/create`,payload);
      return response.data;
  })

  export const GetFormsOne = createAsyncThunk('GetFormsOne',async (payload) => {
    const response = await axiosInstanceToken.get(`/form/fortnightly-monitor`);
      return response.data;
  })

  export const GetSingleFormsOne = createAsyncThunk('GetSingleFormsOne',async (payload) => {
    const response = await axiosInstanceToken.get(`/form/fortnightly-monitor/${payload}`);
      return response.data;
  })


  export const GetSingleFormComplete = createAsyncThunk('GetSingleFormComplete',async (payload) => {
    const response = await axiosInstanceToken.put(`/form/fortnightly-monitor/${payload.id}`,payload.data);
      return response.data;
  })

  const fortnightlySlice = createSlice({
    name: 'fortnightlySlice',
    initialState: {
      data: null,
      getAllForms:null,
      // GetSingleForms:null,
      loading: false,
      error: null,
      message: '', 
    },
    reducers: {
      resetError: (state) => {
        state.error = null;
      },
      fortnightlySlices: (state) => {
        state.message = '';
      },
    },
    extraReducers: (builder) => {
      builder
        // Get GetObserverPendignForms
        .addCase(GetObserverPendignForms.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(GetObserverPendignForms.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(GetObserverPendignForms.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        //Get GetFormsOne


        .addCase(GetFormsOne.pending,(state,action)=>{
          state.loading= true;
          state.error= action.payload
        })
        .addCase(GetFormsOne.fulfilled,(state,action)=>{
          state.loading= false;
          state.getAllForms= action.payload
        })
        .addCase(GetFormsOne.rejected,(state,action)=>{
          state.loading= false;
          state.error= action.payload
        })
        //GetSingleFormsOne

        .addCase(GetSingleFormsOne.pending,(state,action)=>{
          state.loading= true;
          state.error= action.payload
        })
        .addCase(GetSingleFormsOne.fulfilled,(state,action)=>{
          state.loading= false;
          state.GetSingleForms= action.payload
        })
        .addCase(GetSingleFormsOne.rejected,(state,action)=>{
          state.loading= false;
          state.error= action.payload
        })

    },
  });
  
  export const { resetError, fortnightlySlices } = fortnightlySlice.actions;
  export default fortnightlySlice.reducer;
  