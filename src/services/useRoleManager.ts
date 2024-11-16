import { IRoleData } from "store/reducers/LoginSlice";
import { useAppSelector } from "store/storeHooks";

export const useRoleManager = () => {
  const { role } = useAppSelector((store) => store.LoginState);

  const hasAccess = (roleName: keyof IRoleData = "_id") => {
    if (roleName === "_id") {
      return true;
    }
    try {
      const checkAccess = role[roleName];
      return !!checkAccess;
    } catch (err) {
      return false;
    }
  };
  return hasAccess;
};
