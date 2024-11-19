import { configureStore } from '@reduxjs/toolkit';

import userSliceReducer from './userSlice';
import  fortnightlySlices  from './Form/fortnightlySlice';


const store = configureStore({
  reducer: {
    user: userSliceReducer,
    Forms:fortnightlySlices
  },
});

export default store;
