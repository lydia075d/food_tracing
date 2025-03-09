import { User, Product, BorderCrossing } from '../types';
import { addDays } from 'date-fns';

export const dummyUsers: User[] = [
  {
    id: '1',
    email: 'farmer@example.com',
    name: 'John Smith',
    role: 'producer',
    password: 'password123'
  },
  {
    id: '2',
    email: 'border@example.com',
    name: 'Alice Johnson',
    role: 'border_official',
    password: 'password123'
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Robert Davis',
    role: 'admin',
    password: 'password123'
  }
];

export const dummyProducts: Product[] = [
  {
    id: '1',
    batchNumber: 'BATCH001',
    producerId: '1',
    producerName: 'John Smith',
    farmName: 'Green Valley Farms',
    location: {
      lat: 51.505,
      lng: -0.09,
      address: '123 Farm Road, Country'
    },
    itemName: 'Organic Rice',
    quantity: 1000,
    unit: 'kg',
    productionDate: new Date().toISOString(),
    expiryDate: addDays(new Date(), 365).toISOString(),
    transactionId: '0x123...abc',
    qrCode: 'BATCH001',
    status: 'in_transit'
  },
  {
    id: '2',
    batchNumber: 'BATCH002',
    producerId: '1',
    producerName: 'John Smith',
    farmName: 'Green Valley Farms',
    location: {
      lat: 51.515,
      lng: -0.1,
      address: '123 Farm Road, Country'
    },
    itemName: 'Fresh Wheat',
    quantity: 2000,
    unit: 'kg',
    productionDate: new Date().toISOString(),
    expiryDate: addDays(new Date(), 180).toISOString(),
    transactionId: '0x456...def',
    qrCode: 'BATCH002',
    status: 'registered'
  }
];

export const dummyBorderCrossings: BorderCrossing[] = [
  {
    id: '1',
    productId: '1',
    borderName: 'North Border Checkpoint',
    officerId: '2',
    officerName: 'Alice Johnson',
    timestamp: new Date().toISOString(),
    status: 'approved',
    condition: 'pass',
    location: {
      lat: 52.505,
      lng: -1.09
    }
  }
];