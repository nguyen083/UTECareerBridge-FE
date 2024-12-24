import { createSlice } from '@reduxjs/toolkit';


//khởi tạo state ban đầu
const initialState = {
    loading: false,
    current: '1',
    keyword: '',
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
        setInitWeb: (state) => {
            state.loading = false;
            state.current = '1';
            state.keyword = '';
        },
        setKeyword: (state, action) => {
            state.keyword = action.payload;
        }
    },
});

// Export các action để sử dụng trong component
export const { loading, stop, current, setInitWeb, setKeyword } = webSlice.actions;

// Export reducer để sử dụng trong store
export default webSlice.reducer;
