import { combineReducers } from '@reduxjs/toolkit';
// Import reducer từ slice
import employerSlice from './action/employerSlice';
import userSlice from './action/userSlice';

const reducers = combineReducers({
    employer: employerSlice,
    user: userSlice,
});

export default reducers;
