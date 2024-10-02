import { combineReducers } from '@reduxjs/toolkit';
// Import reducer từ slice
import employerSlice from './action/employerSlice';

const reducers = combineReducers({
    employer: employerSlice,
});

export default reducers;
