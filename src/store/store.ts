import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import tableSlice from "components/elements/Table/reducer/table.slice";
import formDrawerSlice from "../components/elements/FormDrawer/formdrawer.slice";
import LoginSlice from "./reducers/LoginSlice";
import sidebarReducer from "./reducers/SidebarSlice";
import SocketSlice from "./reducers/SocketSlice";

const store = configureStore({
  reducer: {
    sideBarData: sidebarReducer,
    formDrawerState: formDrawerSlice,
    tableState: tableSlice,
    LoginState: LoginSlice,
    SocketState: SocketSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
