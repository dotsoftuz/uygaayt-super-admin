import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: JSON.parse(localStorage.getItem("sidebar") || "true") as boolean,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    openSideBarFunc: (state) => {
      localStorage.setItem("sidebar", JSON.stringify(!state.value));
      state.value = !state.value;
    },
    closeSideBarFunc: (state) => {
      localStorage.setItem("sidebar", JSON.stringify(!state.value));
      state.value = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { closeSideBarFunc, openSideBarFunc } = sidebarSlice.actions;

export default sidebarSlice.reducer;
