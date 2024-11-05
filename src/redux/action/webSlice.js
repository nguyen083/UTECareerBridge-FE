import { createSlice } from '@reduxjs/toolkit';


//khởi tạo state ban đầu
const initialState = {
    loading: false,
};

export const webSlice = createSlice({
    name: 'user', //tên của reducer
    initialState,
    reducers: {
        setloading: (state, action) => {
            state.loading = action.payload.loading;
        },
    },
});

// Export các action để sử dụng trong component
export const { setloading } = webSlice.actions;

// Export reducer để sử dụng trong store
export default webSlice.reducer;
