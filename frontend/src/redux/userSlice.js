import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, axiosInstanceToken } from './instence';





export const UserLogin = createAsyncThunk('UserLogin',async (payload) => {
    const response = await axiosInstance.post(`/auth/login`,payload);
      return response.data;
  })

  export const GetUserList = createAsyncThunk('GetUserList',async (payload) => {
    const response = await axiosInstanceToken.get(`/user/get`);
      return response.data;
  })

  export const GetTeacherList = createAsyncThunk('GetTeacherList',async (payload) => {
    const response = await axiosInstanceToken.get(`/user/get/teachers`);
      return response.data;
  })

  export const GetObserverList = createAsyncThunk('GetObserverList',async (payload) => {
    const response = await axiosInstanceToken.get(`/user/get/observer`);
      return response.data;
  })


  export const CreateUserList = createAsyncThunk('CreateUserList',async (payload) => {
    const response = await axiosInstanceToken.post(`/user/create`,payload);
      return response.data;
  })


  export const GetSignleUser = createAsyncThunk('GetSignleUser',async (payload) => {
    const response = await axiosInstanceToken.get(`/user/single/${payload}`);
      return response.data;
  })


  export const UpdateUser = createAsyncThunk('UpdateUser',async (payload) => {
    const response = await axiosInstanceToken.put(`/user/update/${payload.id}`,payload);
      return response.data;
  })
  export const BulkUserCreate = createAsyncThunk('BulkUserCreate',async (payload) => {
    const response = await axiosInstanceToken.post(`/user/bulk-upload`,payload);
      return response.data;
  })

  export const DeleteUser = createAsyncThunk('DeleteUser',async (payload) => {
    const response = await axiosInstanceToken.delete(`/user/delete/${payload}`);
      return response.data;
  })

  
  export const getUserNotification = createAsyncThunk('getUserNotification',async (payload) => {
    const response = await axiosInstanceToken.get(`/notification/get`);
      return response.data;
  })




const userSlice = createSlice({
  name: 'Users',
  initialState: {
    Notification:null,
    GetUsers: null,
    GetTeachersLists: null,
    GetObserverLists: null,
    loading: false,
    error: null,
    signupSuccess: false, 
    message: '', 
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetSignupState: (state) => {
      state.signupSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder

    //Get User Notification

    .addCase(getUserNotification.pending,(state,action)=>{
      state.loading =true;
      state.error =null
    })
    .addCase(getUserNotification.fulfilled,(state,action)=>{
      state.Notification =action.payload;
      state.error=action.payload;
    })
    .addCase(getUserNotification.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    })


      // Get user profile
      .addCase(GetUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(GetUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // GetTeacherList
      .addCase(GetTeacherList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetTeacherList.fulfilled, (state, action) => {
        state.loading = false;
        state.GetTeachersLists = action.payload;
      })
      .addCase(GetTeacherList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //GetObserverList 

      .addCase(GetObserverList.pending,(state,action)=>{
        state.loading =true;
        state.error =null
      })
      .addCase(GetObserverList.fulfilled,(state,action)=>{
        state.GetObserverLists =action.payload;
        state.error=action.payload;
      })
      .addCase(GetObserverList.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
      })

    
  },
});

export const { resetError, resetSignupState } = userSlice.actions;
export default userSlice.reducer;
