import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  render: false,
};
/* this state is useful when you wanna refetch table data,
 set to "reRenderTable" action true so you can refetch */
export const socketSlice = createSlice({
  name: "socketRender",
  initialState: initialState,
  reducers: {
    socketReRender: (state, payload: PayloadAction<boolean>) => {
      state.render = payload.payload;
    },
  },
});

export const { socketReRender } = socketSlice.actions;

export default socketSlice.reducer;
