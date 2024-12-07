import { UseFormReturn } from "react-hook-form";
import { IRoleData } from "store/reducers/LoginSlice";

export interface ICheckboxes {
  role: keyof IRoleData;
  label: string;
}
export type IRoleBody =
  | IRoleData
  | { description: string; _select_all: boolean; _id: string; };

export interface IRolesForm {
  formStore: UseFormReturn<any>;
  editingRoleId?: string;
  resetForm: () => void;
}

export const ALL_ROLES: Array<{
  role: keyof IRoleData;
  label: string;
  childRoles?: any;
}> = [
  {
    role: "order",
    label: "order",
    childRoles: [
      {
        role: "orderCreate",
        label: "create",
      },
      {
        role: "orderUpdate",
        label: "update",
      },
      {
        role: "orderCancel",
        label: "delete",
      },
    ],
  },
  // {
  //   role: "order",
  //   label: "order",
  //   childRoles: [
  //     {
  //       role: "orderCreate",
  //       label: "create",
  //     },
  //     {
  //       role: "orderUpdate",
  //       label: "update",
  //     },
  //     {
  //       role: "orderDelete",
  //       label: "delete",
  //     },
  //   ],
  // },
  {
    role: "customer",
    label: "customer",
    childRoles: [
      {
        role: "customerCreate",
        label: "create",
      },
      {
        role: "customerUpdate",
        label: "update",
      },
      {
        role: "customerDelete",
        label: "delete",
      },
    ],
  },
  {
    role: "product",
    label: "product",
    childRoles: [
      {
        role: "productCreate",
        label: "create",
      },
      {
        role: "productUpdate",
        label: "update",
      },
      {
        role: "productDelete",
        label: "delete",
      },
    ],
  },
  {
    role: "category",
    label: "category",
    childRoles: [
      {
        role: "categoryCreate",
        label: "create",
      },
      {
        role: "categoryUpdate",
        label: "update",
      },
      {
        role: "categoryDelete",
        label: "delete",
      },
    ],
  },
  {
    role: "employee",
    label: "employee",
    childRoles: [
      {
        role: "employeeCreate",
        label: "create",
      },
      {
        role: "employeeUpdate",
        label: "update",
      },
      {
        role: "employeeDelete",
        label: "delete",
      },
    ],
  },
  {
    role: "role",
    label: "role",
    childRoles: [
      {
        role: "roleCreate",
        label: "create",
      },
      {
        role: "roleUpdate",
        label: "update",
      },
      {
        role: "roleDelete",
        label: "delete",
      },
    ],
  },
  {
    role: "courier",
    label: "courier",
    childRoles: [
      {
        role: "courierCreate",
        label: "create",
      },
      {
        role: "courierUpdate",
        label: "update",
      },
      {
        role: "courierDelete",
        label: "delete",
      },
    ],
  },
  {
    role: "banner",
    label: "banner",
    childRoles: [
      {
        role: "bannerCreate",
        label: "create",
      },
      {
        role: "bannerUpdate",
        label: "update",
      },
      {
        role: "bannerDelete",
        label: "delete",
      },
    ],
  },
  {
    role: "news",
    label: "news",
    childRoles: [
      {
        role: "newsCreate",
        label: "create",
      },
      {
        role: "newsUpdate",
        label: "update",
      },
      {
        role: "newsDelete",
        label: "delete",
      },
    ],
  },
  // {
  //   role: "measure",
  //   label: "measure",
  //   childRoles: [
  //     {
  //       role: "measureCreate",
  //       label: "create",
  //     },
  //     {
  //       role: "measureUpdate",
  //       label: "update",
  //     },
  //     {
  //       role: "measureDelete",
  //       label: "delete",
  //     },
  //   ],
  // },
  {
    role: "rateComment",
    label: "rateComment",
    childRoles: [
      {
        role: "rateCommentCreate",
        label: "create",
      },
      {
        role: "rateCommentUpdate",
        label: "update",
      },
      {
        role: "rateCommentDelete",
        label: "delete",
      },
    ],
  },
  {
    role: "store",
    label: "store",
    childRoles: [
      {
        role: "storeUpdate",
        label: "update",
      },
    ],
  },
  {
    role: "integration",
    label: "integration",
    childRoles: [
      {
        role: "integrationUpdate",
        label: "update",
      },
    ],
  },

  {
    role: "stateMap",
    label: "stateMap",
  },
  {
    role: "transaction",
    label: "transaction",
    childRoles: [
      {
        role: "transactionCreate",
        label: "create",
      },
    ],
  },
  {
    role: "settings",
    label: "settings",
    childRoles: [
      {
        role: "settingsUpdate",
        label: "update",
      },
    ],
  },
  {
    role: "report",
    label: "report",
  },
  // {
  //   role: "siteSettings",
  //   label: "siteSettings",
  //   childRoles: [
  //     {
  //       role: "siteSettingsUpdate",
  //       label: "update",
  //     },
  //   ],
  // },
];
