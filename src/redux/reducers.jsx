import { combineReducers } from '@reduxjs/toolkit';
// Import reducer từ slice
import employerSlice from './action/employerSlice';
import notificationSlice from './action/notificationSlice';
import userSlice from './action/userSlice';
import webSlice from './action/webSlice';
import studentSlice from './action/studentSlice';

const reducers = combineReducers({
    employer: employerSlice,
    notification: notificationSlice,
    user: userSlice,
    web: webSlice,
    student: studentSlice,
});

export default reducers;
