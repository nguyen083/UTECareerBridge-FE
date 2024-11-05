import { combineReducers } from '@reduxjs/toolkit';
// Import reducer từ slice
import employerSlice from './action/employerSlice';
import notificationSlice from './action/notificationSlice';
import userSlice from './action/userSlice';
import webSlice from './action/webSlice';

const reducers = combineReducers({
    employer: employerSlice,
    notification: notificationSlice,
    user: userSlice,
    web: webSlice,
});

export default reducers;
