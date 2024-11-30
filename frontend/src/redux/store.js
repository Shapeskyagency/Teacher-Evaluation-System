import { configureStore } from '@reduxjs/toolkit';

import userSliceReducer from './userSlice';
import  fortnightlySlices  from './Form/fortnightlySlice';
import classroomWalkthroughSliceReducer from './Form/classroomWalkthroughSlice'


const store = configureStore({
  reducer: {
    user: userSliceReducer,
    Forms: fortnightlySlices,
    walkThroughForm:classroomWalkthroughSliceReducer
  },
});

export default store;
