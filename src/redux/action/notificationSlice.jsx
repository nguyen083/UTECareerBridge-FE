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
    },
    setInitNotification: (state, action) => {
      state.unread = 0;
    }
  }
});

export const { setNotificationCount, setInitNotification } = notificationSlice.actions;
export default notificationSlice.reducer;