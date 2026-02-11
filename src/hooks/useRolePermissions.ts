import { useSelector } from "react-redux";
import { RootState } from "store/store";
import {
  canAccessStore,
  canCreateStore,
  canUpdateStore,
  canDeleteStore,
  canAccessRestaurant,
  canCreateRestaurant,
  canUpdateRestaurant,
  canDeleteRestaurant,
  canAccessReview,
  canCreateReview,
  canUpdateReview,
  canDeleteReview,
  hasStoreOrRestaurantAccess,
  hasReviewAccess,
  canManageStoresRestaurantsReviews,
} from "utils/rolePermissions";

export const useRolePermissions = () => {
  const role = useSelector((state: RootState) => state.LoginState.role);

  return {
    role,
    // Store permissions
    canAccessStore: () => canAccessStore(role),
    canCreateStore: () => canCreateStore(role),
    canUpdateStore: () => canUpdateStore(role),
    canDeleteStore: () => canDeleteStore(role),
    
    // Restaurant permissions
    canAccessRestaurant: () => canAccessRestaurant(role),
    canCreateRestaurant: () => canCreateRestaurant(role),
    canUpdateRestaurant: () => canUpdateRestaurant(role),
    canDeleteRestaurant: () => canDeleteRestaurant(role),
    
    // Review permissions
    canAccessReview: () => canAccessReview(role),
    canCreateReview: () => canCreateReview(role),
    canUpdateReview: () => canUpdateReview(role),
    canDeleteReview: () => canDeleteReview(role),
    
    // Combined permissions
    hasStoreOrRestaurantAccess: () => hasStoreOrRestaurantAccess(role),
    hasReviewAccess: () => hasReviewAccess(role),
    canManageStoresRestaurantsReviews: () => canManageStoresRestaurantsReviews(role),
  };
};
