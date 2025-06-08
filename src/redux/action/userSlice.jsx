import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    userId: null,
    role: null,
    email: null,
};

export const userSlice = createSlice({
    name: 'user',
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

export const { setInfor, setInitUser } = userSlice.actions;

export default userSlice.reducer;
