import { createSlice } from "@reduxjs/toolkit";

//khởi tạo state ban đầu
const initialState = {
  loading: false,
  current: "1",
  keyword: "",
  lang: "en",
};

export const webSlice = createSlice({
  name: "web",
  initialState,
  reducers: {
    loading: (state) => {
      state.loading = true;
    },
    stop: (state) => {
      state.loading = false;
    },
    current: (state, action) => {
      state.current = action.payload;
    },
    setInitWeb: (state) => {
      state.loading = false;
      state.current = "1";
      state.keyword = "";
    },
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setLang: (state, action) => {
      state.lang = action.payload;
    },
  },
});

// Export các action để sử dụng trong component
export const { loading, stop, current, setInitWeb, setKeyword, setLang } =
  webSlice.actions;

// Export reducer để sử dụng trong store
export default webSlice.reducer;
