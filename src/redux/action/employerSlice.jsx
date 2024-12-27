import { createSlice } from '@reduxjs/toolkit';

//khởi tạo state ban đầu
const initialState = {
    phoneNumber: null,
    firstName: null,
    lastName: null,
    gender: null,
    address: null,
    dob: null,
    roleId: null,
    companyName: null,
    companyAddress: null,
    companyLogo: null,
    companyEmail: null,
    companyDescription: null,
    companyWebsite: null,
    backgroundImage: null,
    videoIntroduction: null,
    companySize: null,
    businessCertificate: null,
    industryId: null,
    countFollower: null,
    countJob: null,
    id: null,
    benefitArray: [],
};

export const employerSlice = createSlice({
    name: 'employer', //tên của reducer
    initialState,
    reducers: {
        setInfor: (state, action) => {
            state.phoneNumber = action.payload.phoneNumber;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.gender = action.payload.gender ? 1 : 0;
            state.address = action.payload.address;
            state.dob = action.payload.dob;
            state.roleId = action.payload.role.roleId;
            state.companyName = action.payload.companyName;
            state.companyAddress = action.payload.companyAddress;
            state.companyLogo = action.payload.companyLogo;
            state.companyEmail = action.payload.companyEmail;
            state.companyDescription = action.payload.companyDescription;
            state.companyWebsite = action.payload.companyWebsite;
            state.backgroundImage = action.payload.backgroundImage;
            state.videoIntroduction = action.payload.videoIntroduction;
            state.companySize = action.payload.companySize || "";
            state.businessCertificate = action.payload.businessCertificate;
            state.industryId = action.payload?.industry?.industryId || 0;
            state.id = action.payload.id;
            state.countFollower = action.payload.countFollower;
            state.countJob = action.payload.countJob;
            state.benefitArray = action.payload.benefitDetails.map((benefit) => {
                return {
                    benefitId: benefit.benefitId,
                    description: benefit.description
                }
            });
        },
        setBusinessCertificate: (state, action) => {
            state.businessCertificate = action.payload.data;
        },
        setInitEmployer: (state, action) => {
            state.phoneNumber = null;
            state.firstName = null;
            state.lastName = null
            state.gender = null;
            state.address = null;
            state.dob = null;
            state.roleId = null;
            state.companyName = null;
            state.companyAddress = null;
            state.companyLogo = null;
            state.companyEmail = null;
            state.companyDescription = null;
            state.companyWebsite = null;
            state.backgroundImage = null;
            state.videoIntroduction = null;
            state.companySize = null;
            state.businessCertificate = null;
            state.industryId = null;
            state.countFollower = null;
            state.countJob = null;
            state.id = null;
            state.benefitArray = [];
        },
    },
});

// Export các action để sử dụng trong component
export const { setInfor, setInitEmployer, setBusinessCertificate } = employerSlice.actions;

// Export reducer để sử dụng trong store
export default employerSlice.reducer;
