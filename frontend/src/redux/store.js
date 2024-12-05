import { configureStore } from '@reduxjs/toolkit';

import userSliceReducer from './userSlice';
import  fortnightlySlices  from './Form/fortnightlySlice';
import classroomWalkthroughSliceReducer from './Form/classroomWalkthroughSlice'
import noteBookSliceReducer from './Form/noteBookSlice'


const store = configureStore({
  reducer: {
    user: userSliceReducer,
    Forms: fortnightlySlices,
    walkThroughForm:classroomWalkthroughSliceReducer,
    notebook:noteBookSliceReducer
  },
});

export default store;
