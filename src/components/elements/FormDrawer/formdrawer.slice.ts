import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  disableSubmitButton: false,
};

export const formDrawerSlice = createSlice({
  name: "formDrawer",
  initialState: initialState,
  reducers: {
    setOpenDrawer: (state, { payload }: PayloadAction<boolean>) => {
      state.isOpen = payload;
    },
    setButtonDisable: (state, { payload }: PayloadAction<boolean>) => {
      state.disableSubmitButton = payload;
    },
  },
});

export const { setOpenDrawer, setButtonDisable } = formDrawerSlice.actions;

export default formDrawerSlice.reducer;
