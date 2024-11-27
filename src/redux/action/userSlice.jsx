import { createSlice } from '@reduxjs/toolkit';


//khởi tạo state ban đầu
const initialState = {
    userId: null,
    role: null,

};

export const userSlice = createSlice({
    name: 'user', //tên của reducer
    initialState,
    reducers: {
        setInfor: (state, action) => {
            state.userId = action.payload.userId;
            state.role = action.payload?.role;
        },
        setNull: (state) => {
            state = { ...initialState };
        }
    },
});

// Export các action để sử dụng trong component
export const { setInfor, setNull } = userSlice.actions;

// Export reducer để sử dụng trong store
export default userSlice.reducer;
