import { createSlice } from '@reduxjs/toolkit';

//khởi tạo state ban đầu
const initialState = {
    firstName: null,
    lastName: null,
    email: null,
    phoneNumber: null,
    gender: null,
    dob: null,
    provinceId: null,
    districtId: null,
    wardId: null,
    address: null,
    universityEmail: null,
    year: null,
    profileImage: null,
    categoryId: null,
    findingJob: null,
};

export const studentSlice = createSlice({
    name: 'student', //tên của reducer
    initialState,
    reducers: {
        setInforStudent: (state, action) => {
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.phoneNumber = action.payload.phoneNumber;
            state.gender = action.payload.gender;
            state.dob = action.payload.dob;
            state.provinceId = action.payload.provinceId;
            state.districtId = action.payload.districtId;
            state.wardId = action.payload.wardId;
            state.address = action.payload.address;
            state.universityEmail = action.payload.universityEmail;
            state.year = action.payload.year;
            state.profileImage = action.payload.profileImage;
            state.categoryId = action.payload.categoryId;
            state.findingJob = action.payload.findingJob;
        },
        setFindJob: (state, action) => {
            state.findingJob = action.payload;
        },
        setInitStudent: (state) => {
            state.firstName = null;
            state.lastName = null;
            state.email = null;
            state.phoneNumber = null;
            state.gender = null;
            state.dob = null;
            state.provinceId = null;
            state.districtId = null;
            state.wardId = null;
            state.address = null;
            state.universityEmail = null;
            state.year = null;
            state.profileImage = null;
            state.categoryId = null;
            state.findingJob = null;
        },
    },
});

// Export các action để sử dụng trong component
export const { setInforStudent, setInitStudent, setFindJob } = studentSlice.actions;

// Export reducer để sử dụng trong store
export default studentSlice.reducer;
