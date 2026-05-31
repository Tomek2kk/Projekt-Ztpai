export interface CarPart {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  sku: string;
  price: number;
  quantityInStock: number;
  description: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarPartRequest {
  name: string;
  category: string;
  manufacturer: string;
  sku: string;
  price: number;
  quantityInStock: number;
  description: string;
  imageUrl: string;
  active: boolean;
}
