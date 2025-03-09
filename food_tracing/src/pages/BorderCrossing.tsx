import React, { useState } from 'react';
import { dummyProducts } from '../data/dummyData';

function BorderCrossing() {
  const [batchNumber, setBatchNumber] = useState('');
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [condition, setCondition] = useState<'pass' | 'fail'>('pass');
  const [officerName, setOfficerName] = useState('');
  const [officerId, setOfficerId] = useState('');

  const handleScan = () => {
    const product = dummyProducts.find(p => p.batchNumber === batchNumber);
    setScannedProduct(product || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the blockchain
    console.log('Border crossing recorded:', {
      product: scannedProduct,
      condition,
      officerName,
      officerId,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Border Crossing Verification</h1>

      {/* Scan Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Scan Product</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            placeholder="Enter Batch Number"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleScan}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Scan
          </button>
        </div>
      </div>

      {scannedProduct && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  value={scannedProduct.itemName}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Producer Name</label>
                <input
                  type="text"
                  value={scannedProduct.producerName}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="text"
                  value={`${scannedProduct.quantity} ${scannedProduct.unit}`}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Production Date</label>
                <input
                  type="text"
                  value={new Date(scannedProduct.productionDate).toLocaleDateString()}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Border Official Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Border Official Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Officer Name</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Officer ID</label>
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Condition Check */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Food Condition Check</h2>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="pass"
                  checked={condition === 'pass'}
                  onChange={(e) => setCondition(e.target.value as 'pass')}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2">✅ Pass</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="fail"
                  checked={condition === 'fail'}
                  onChange={(e) => setCondition(e.target.value as 'fail')}
                  className="form-radio h-5 w-5 text-red-600"
                />
                <span className="ml-2">❌ Fail</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Approve Entry
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reject Entry
            </button>
            <button
              type="button"
              onClick={() => {
                setBatchNumber('');
                setScannedProduct(null);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Scan Another
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default BorderCrossing;