export interface User {
  id: string;
  email: string;
  name: string;
  role: 'producer' | 'border_official' | 'admin';
  password: string;
}

export interface Product {
  id: string;
  batchNumber: string;
  producerId: string;
  producerName: string;
  farmName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  itemName: string;
  quantity: number;
  unit: string;
  productionDate: string;
  expiryDate: string;
  transactionId: string;
  certificateUrl?: string;
  status: 'registered' | 'in_transit' | 'delivered' | 'rejected';
  qrCode: string;
}

export interface BorderCrossing {
  id: string;
  productId: string;
  borderName: string;
  officerId: string;
  officerName: string;
  timestamp: string;
  status: 'approved' | 'rejected';
  condition: 'pass' | 'fail';
  reason?: string;
  location: {
    lat: number;
    lng: number;
  };
}