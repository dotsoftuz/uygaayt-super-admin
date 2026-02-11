import { IRoleData } from "store/reducers/LoginSlice";

export const checkRolePermission = (
  role: IRoleData,
  permission: keyof IRoleData
): boolean => {
  return !!role[permission];
};

export const canAccessStore = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'store');
};

export const canCreateStore = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'storeCreate');
};

export const canUpdateStore = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'storeUpdate');
};

export const canDeleteStore = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'storeDelete');
};

export const canAccessRestaurant = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'restaurant');
};

export const canCreateRestaurant = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'restaurantCreate');
};

export const canUpdateRestaurant = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'restaurantUpdate');
};

export const canDeleteRestaurant = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'restaurantDelete');
};

export const canAccessReview = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'review');
};

export const canCreateReview = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'reviewCreate');
};

export const canUpdateReview = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'reviewUpdate');
};

export const canDeleteReview = (role: IRoleData): boolean => {
  return checkRolePermission(role, 'reviewDelete');
};

export const hasStoreOrRestaurantAccess = (role: IRoleData): boolean => {
  return canAccessStore(role) || canAccessRestaurant(role);
};

export const hasReviewAccess = (role: IRoleData): boolean => {
  return canAccessReview(role);
};

export const canManageStoresRestaurantsReviews = (role: IRoleData): boolean => {
  return (
    canAccessStore(role) ||
    canAccessRestaurant(role) ||
    canAccessReview(role)
  );
};
