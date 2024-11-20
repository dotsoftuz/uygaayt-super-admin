import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type ILoginData = typeof initialState.loginData;
export type IRoleData = typeof initialState.role;

const initialState = {
  isAuth: false,
  isConnected: false,
  isFree: false,
  role: {
    _id: "",
    name: "",
    order: false,
    orderCreate: false,
    orderUpdate: false,
    orderDelete: false,
    orderState: false,
    orderStateCreate: false,
    orderStateUpdate: false,
    orderStateDelete: false,
    store: false,
    storeUpdate: false,
    customer: false,
    customerCreate: false,
    customerUpdate: false,
    customerDelete: false,
    product: false,
    productCreate: false,
    productUpdate: false,
    productDelete: false,
    storeProductCategory: false,
    storeProductCategoryCreate: false,
    storeProductCategoryUpdate: false,
    storeProductCategoryDelete: false,
    employee: false,
    employeeCreate: false,
    employeeUpdate: false,
    employeeDelete: false,
    courier: false,
    courierCreate: false,
    courierUpdate: false,
    courierDelete: false,
    role: false,
    roleCreate: false,
    roleUpdate: false,
    roleDelete: false,
    banner: false,
    bannerCreate: false,
    bannerUpdate: false,
    bannerDelete: false,
    measure: false,
    measureCreate: false,
    measureDelete: false,
    measureUpdate: false,
    rateComment: false,
    rateCommentCreate: false,
    rateCommentUpdate: false,
    rateCommentDelete: false,
    integration: false,
    integrationUpdate: false,
    stateMap: false,
    transaction: false,
    transactionCreate: false,
    settings: false,
    settingsUpdate: false,
    siteSettings: false,
    siteSettingsUpdate: false,
  },
  loginData: {
    token: "string",
    employee: {
      _id: "",
      firstName: "",
      lastName: "",
      fullName: "",
      phoneNumber: "",
      language: "",
      roleId: "",
      isBoss: false,
      createdAt: "",
      updatedAt: "",
      deletedAt: 0
    }
  }
  
};

const LoginSlice = createSlice({
  name: "login-data",
  initialState,
  reducers: {
    setLoginData(state, payload: PayloadAction<ILoginData>) {
      state.loginData = payload.payload;
      state.isAuth = true;
    },
    setRoleData(state, payload) {
      state.role = payload.payload;
    },
    setSocketConnect(state, payload: PayloadAction<boolean>) {
      state.isConnected = payload.payload;
    },
    setIsFree(state, payload: PayloadAction<boolean>) {
      state.isFree = payload.payload;
    },
  },
});

export const { setLoginData, setRoleData, setSocketConnect, setIsFree } =
  LoginSlice.actions;

export default LoginSlice.reducer;
