import { combineReducers } from '@reduxjs/toolkit';
// Import reducer từ slice
import employerSlice from './action/employerSlice';
import notificationSlice from './action/notificationSlice'; 
import userSlice from './action/userSlice';

const reducers = combineReducers({
    employer: employerSlice,
    notification: notificationSlice, 
    user: userSlice,
});

export default reducers;
