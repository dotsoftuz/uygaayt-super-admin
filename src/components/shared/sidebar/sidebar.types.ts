import { IRoleData } from "store/reducers/LoginSlice";

export interface ISidebarRoute {
  icon?: React.ReactNode;
  path?: string;
  items?: this[];
  role?: keyof IRoleData;
  translate?: string;
}
