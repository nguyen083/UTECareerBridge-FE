import { createSlice } from '@reduxjs/toolkit';


//khởi tạo state ban đầu
const initialState = {
    userId: null,
    role: null,
    email: null,
};

export const userSlice = createSlice({
    name: 'user', //tên của reducer
    initialState,
    reducers: {
        setInfor: (state, action) => {
            state.userId = action.payload.userId;
            state.role = action.payload?.role;
            state.email = action.payload.email;
        },
        setInitUser: (state) => {
            state.userId = null;
            state.role = null;
            state.email = null;
        }
    },
});

// Export các action để sử dụng trong component
export const { setInfor, setInitUser } = userSlice.actions;

// Export reducer để sử dụng trong store
export default userSlice.reducer;
