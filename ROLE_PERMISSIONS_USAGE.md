# Role Permissions Implementation

## Overview
This document explains how to use the role permission system for stores, restaurants, and reviews pages.

## Files Modified/Created

### 1. Updated Files
- `src/pages/role/components/RoleForm.constants.ts` - Added new role permissions
- `src/store/reducers/LoginSlice.ts` - Added new role properties to the state

### 2. New Files Created
- `src/utils/rolePermissions.ts` - Permission checking utilities
- `src/hooks/useRolePermissions.ts` - React hook for role permissions
- `src/components/ProtectedRoute/ProtectedRoute.tsx` - Route protection components

## Usage Examples

### 1. Using the Hook in Components

```tsx
import { useRolePermissions } from "hooks/useRolePermissions";

const MyComponent = () => {
  const {
    canAccessStore,
    canCreateStore,
    canUpdateStore,
    canDeleteStore,
    canAccessRestaurant,
    canAccessReview,
  } = useRolePermissions();

  return (
    <div>
      {canAccessStore() && <StoreComponent />}
      {canCreateStore() && <CreateStoreButton />}
      {canAccessRestaurant() && <RestaurantComponent />}
      {canAccessReview() && <ReviewComponent />}
    </div>
  );
};
```

### 2. Using Protected Routes

```tsx
import { StoreProtectedRoute, RestaurantProtectedRoute, ReviewProtectedRoute } from "components/ProtectedRoute";

// Protect store pages
<StoreProtectedRoute>
  <StoresPage />
</StoreProtectedRoute>

// Protect restaurant pages
<RestaurantProtectedRoute>
  <RestaurantsPage />
</RestaurantProtectedRoute>

// Protect review pages
<ReviewProtectedRoute>
  <ReviewsPage />
</ReviewProtectedRoute>
```

### 3. Conditional Rendering Based on Permissions

```tsx
import { useRolePermissions } from "hooks/useRolePermissions";

const StoreManagement = () => {
  const { canCreateStore, canUpdateStore, canDeleteStore } = useRolePermissions();

  return (
    <div>
      <h1>Store Management</h1>
      
      {canCreateStore() && (
        <button onClick={() => setShowCreateModal(true)}>
          Create New Store
        </button>
      )}
      
      <StoreTable 
        onEdit={canUpdateStore() ? handleEdit : undefined}
        onDelete={canDeleteStore() ? handleDelete : undefined}
      />
    </div>
  );
};
```

### 4. API Integration Example

```tsx
import { useRolePermissions } from "hooks/useRolePermissions";
import { useApi } from "hooks/useApi/useApiHooks";

const StoreList = () => {
  const { canAccessStore } = useRolePermissions();
  
  const { data: stores } = useApi("store/paging", {}, {
    enabled: canAccessStore()
  });

  if (!canAccessStore()) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      {stores?.data?.map(store => (
        <div key={store._id}>{store.name}</div>
      ))}
    </div>
  );
};
```

## Available Permissions

### Store Permissions
- `store` - Access store pages
- `storeCreate` - Create new stores
- `storeUpdate` - Update existing stores
- `storeDelete` - Delete stores

### Restaurant Permissions
- `restaurant` - Access restaurant pages
- `restaurantCreate` - Create new restaurants
- `restaurantUpdate` - Update existing restaurants
- `restaurantDelete` - Delete restaurants

### Review Permissions
- `review` - Access review pages
- `reviewCreate` - Create new reviews
- `reviewUpdate` - Update existing reviews
- `reviewDelete` - Delete reviews

## Role Management

When creating or updating roles in the admin panel, you can now select permissions for:
- Stores (create, update, delete)
- Restaurants (create, update, delete)
- Reviews (create, update, delete)

The permissions are organized in accordion-style checkboxes in the role form, making it easy to manage access for different user types.

## Testing

To test the implementation:
1. Create a new role with specific store/restaurant/review permissions
2. Assign this role to a user
3. Log in as that user and verify access controls work correctly
4. Test both positive (has permission) and negative (no permission) scenarios
