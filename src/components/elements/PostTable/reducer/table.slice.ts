import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  render: false,
};
/* this state is useful when you wanna refetch table data,
 set to "reRenderTable" action true so you can refetch */
export const tableSlice = createSlice({
  name: "tableSlice",
  initialState: initialState,
  reducers: {
    reRenderTable: (state, payload: PayloadAction<boolean>) => {
      state.render = payload.payload;
    },
  },
});

export const { reRenderTable } = tableSlice.actions;

export default tableSlice.reducer;
