import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstanceToken } from './instence';





export const UserLogin = createAsyncThunk('UserLogin',async (payload) => {
    const response = await axiosInstanceToken.post(`/auth/login`,payload);
      return response.data;
  })

  export const GetUserList = createAsyncThunk('GetUserList',async (payload) => {
    const response = await axiosInstanceToken.get(`/user/get`);
      return response.data;
  })



















// Fetch user profile
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceToken.get(`/user/get-profile/${userId}`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (payload) => {
    const response = await axiosInstanceToken.put(`/user/update-profile/${payload?.userId}`, payload?.formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.user;
  }
);

// Update user password
export const updateUserPassword = createAsyncThunk(
  'user/updateUserPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceToken.put(`/user/change-password/${payload?.userId}`, {
        oldPassword: payload?.oldPassword,
        newPassword: payload?.newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Signup user
export const signupUser = createAsyncThunk(
  'user/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceToken.post('/auth/signup', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        username: userData.username,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
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
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user password
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = 'Password updated successfully'; 
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup user
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.signupSuccess = true;
        state.message = action.payload.message; 
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.signupSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetSignupState } = userSlice.actions;
export default userSlice.reducer;
