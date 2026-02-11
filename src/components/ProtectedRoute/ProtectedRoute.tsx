import React from "react";
import { useRolePermissions } from "hooks/useRolePermissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: () => boolean;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  fallback = <div>Sizda bu sahifaga kirish huquqi yo'q</div>,
}) => {
  const { canManageStoresRestaurantsReviews } = useRolePermissions();

  const hasPermission = requiredPermission ? requiredPermission() : canManageStoresRestaurantsReviews();

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const StoreProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    requiredPermission={() => {
      const { canAccessStore } = useRolePermissions();
      return canAccessStore();
    }}
  >
    {children}
  </ProtectedRoute>
);

export const RestaurantProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    requiredPermission={() => {
      const { canAccessRestaurant } = useRolePermissions();
      return canAccessRestaurant();
    }}
  >
    {children}
  </ProtectedRoute>
);

export const ReviewProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    requiredPermission={() => {
      const { canAccessReview } = useRolePermissions();
      return canAccessReview();
    }}
  >
    {children}
  </ProtectedRoute>
);
