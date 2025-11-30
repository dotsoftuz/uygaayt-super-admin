export interface IOrder {
  _id: string;
  isPaid: boolean;
  number: string;
  createdAt: string;
  storeId: string;
  customerId: string;
  courierId?: string;
  stateId: string;
  itemPrice: number;
  totalPrice: number;
  addressName: string;
  addressLocation: {
    latitude: number;
    longitude: number;
  };
  houseNumber: string;
  entrance: string;
  apartmentNumber: string;
  floor: string;
  paymentType: string;
  comment: string;
  state: {
    _id: string;
    state: string;
    color: string;
    name: string;
  };
  customer: {
    _id: string;
    firstName: string;
    phoneNumber: string;
    lastName: string;
  };
  store?: {
    _id: string;
    name: string;
    phoneNumber?: string;
    addressName?: string;
  };
  items: {
    _id: string;
    productId: string;
    price: number;
    amount: number;
    product: {
      _id: string;
      name: string;
      mainImage: {
        _id: string;
        url: string;
        sizes: {
          url: string;
          width: number;
          height: number;
        }[];
      };
    };
  }[];
}

export interface IProduct {
  _id: string;
  number: string;
  createdAt: string;
  name: string;
  price: number;
  amount: any;
  salePrice: number;
  discountEnabled: boolean;
  discountType: string;
  discountValue: number;
  inStock: number;
  description: string;
  mainImageId: string;
  imageIds: string[];
  attributes: any[]
  attributeDetails: any[]
  variants?:any[];
  category: {
    _id: string;
    name: string;
  };
  parentCategoryId?:string;
  categoryId: string;
  storeId: string;
  bitoId: string | null;
  discountStartAt: any;
  discountEndAt: any;
  compounds: any[],
  images?: {
    _id: string;
    url: string;
  }[];
  mainImage: {
    _id: string;
    url: string;
    sizes: string[];
  };
  locationBlock?: string;
  locationShelf?: string;
  locationRow?: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}