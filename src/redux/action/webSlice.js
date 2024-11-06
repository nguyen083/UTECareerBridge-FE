import { createSlice } from '@reduxjs/toolkit';


//khởi tạo state ban đầu
const initialState = {
    loading: false,
    current: '1',
};

export const webSlice = createSlice({
    name: 'web', //tên của reducer
    initialState,
    reducers: {
        loading: (state, action) => {
            state.loading = true;
        },
        stop: (state, action) => {
            state.loading = false;
        },
        current: (state, action) => {
            state.current = action.payload;
        },

    },
});

// Export các action để sử dụng trong component
export const { loading, stop, current } = webSlice.actions;

// Export reducer để sử dụng trong store
export default webSlice.reducer;
