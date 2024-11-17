import { createSlice } from '@reduxjs/toolkit';


//khởi tạo state ban đầu
const initialState = {
    userId: null,
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    dob: null,
    address: null,
    role: null,
    active: null,
};

export const userSlice = createSlice({
    name: 'user', //tên của reducer
    initialState,
    reducers: {
        setInfor: (state, action) => {
            state.userId = action.payload.userId;
            state.firstName = action.payload?.firstName;
            state.lastName = action.payload?.lastName;
            state.email = action.payload?.email;
            state.phone = action.payload?.phone;
            state.dob = action.payload?.dob;
            state.address = action.payload?.address;
            state.role = action.payload?.role;
            state.active = action.payload?.active
        },
        setNull: (state, action) => {
            state.userId = null;
            state.firstName = null;
            state.lastName = null;
            state.email = null;
            state.phone = null;
            state.dob = null;
            state.address = null;
            state.role = null;
            state.active = null
        }
    },
});

// Export các action để sử dụng trong component
export const { setInfor, setNull } = userSlice.actions;

// Export reducer để sử dụng trong store
export default userSlice.reducer;
