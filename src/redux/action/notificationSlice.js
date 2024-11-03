import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unread: 0
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationCount: (state, action) => {
      state.unread = action.payload;
    }
  }
});

export const { setNotificationCount } = notificationSlice.actions;
export default notificationSlice.reducer;