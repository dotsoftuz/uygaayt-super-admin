const STORES_LOCAL_STORAGE_KEY = "stores_restaurants_local";

export interface ILocalStore {
  _id: string;
  name: string;
  phoneNumber: string;
  addressName?: string;
  addressLocation?: {
    latitude: number;
    longitude: number;
  };
  categoryId?: string;
  category?: string;
  minimumOrderAmount?: number;
  commissionPercent?: number;
  paymentMethods?: {
    card: boolean;
    cash: boolean;
    bonus: boolean;
  };
  workTime?: string;
  description?: string;
  logoId?: string;
  bannerId?: string;
  isActive?: boolean;
  totalOrders?: number;
  totalRevenue?: number;
  createdAt: string;
  updatedAt: string;
}

export const getStoresFromLocalStorage = (): ILocalStore[] => {
  try {
    const stores = localStorage.getItem(STORES_LOCAL_STORAGE_KEY);
    return stores ? JSON.parse(stores) : [];
  } catch (error) {
    console.error("Error reading stores from localStorage:", error);
    return [];
  }
};

export const saveStoreToLocalStorage = (store: ILocalStore): void => {
  try {
    const stores = getStoresFromLocalStorage();
    const existingIndex = stores.findIndex((s) => s._id === store._id);
    
    if (existingIndex >= 0) {
      // Update existing store
      stores[existingIndex] = {
        ...store,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new store
      const newStore: ILocalStore = {
        ...store,
        _id: store._id || `store_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isActive: store.isActive ?? false,
        totalOrders: store.totalOrders || 0,
        totalRevenue: store.totalRevenue || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      stores.push(newStore);
    }
    
    localStorage.setItem(STORES_LOCAL_STORAGE_KEY, JSON.stringify(stores));
  } catch (error) {
    console.error("Error saving store to localStorage:", error);
  }
};

export const deleteStoreFromLocalStorage = (storeId: string): void => {
  try {
    const stores = getStoresFromLocalStorage();
    const filteredStores = stores.filter((s) => s._id !== storeId);
    localStorage.setItem(STORES_LOCAL_STORAGE_KEY, JSON.stringify(filteredStores));
  } catch (error) {
    console.error("Error deleting store from localStorage:", error);
  }
};

export const activateStoreInLocalStorage = (storeId: string): void => {
  try {
    const stores = getStoresFromLocalStorage();
    const store = stores.find((s) => s._id === storeId);
    if (store) {
      store.isActive = true;
      store.updatedAt = new Date().toISOString();
      localStorage.setItem(STORES_LOCAL_STORAGE_KEY, JSON.stringify(stores));
    }
  } catch (error) {
    console.error("Error activating store in localStorage:", error);
  }
};

