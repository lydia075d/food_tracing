import React, { useEffect, useState, Key } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { dummyProducts, dummyBorderCrossings } from '../data/dummyData';
import 'leaflet/dist/leaflet.css';
import { ethers } from 'ethers';
import FoodTraceabilityABI from '../abis/FoodTraceability.json';

const CONTRACT_ADDRESS = "0xa54743be4d7c92E29F9975A4687c9b2f3A2e5A08";
const CONTRACT_ABI = FoodTraceabilityABI.abi ;

interface Product {
  exists: string;
  farmName: string;
  id: Key | null | undefined;
  quantity: number;
  location: any;
  itemName: string;
  batchNumber: string;
  status: number;
  producerName: string;
}

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("userRole"));
  const [web3, setWeb3] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || product.status.toString() === filterType;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
      const initialize = async () => {
        if (userRole && window.ethereum) {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            setWeb3(provider);
            setContract(contract);
            setAccount(await signer.getAddress());
          } catch (error) {
            console.error("Initialization error:", error);
            alert("Error connecting to blockchain");
          }
        }
      };
      initialize();
    }, [userRole]);
  const fetchProducts = async () => {
    if (!contract) return;
    
    try {
      const result = await contract.listAllProducts();
      setProducts(result);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch products");
    }
    console.log(products);
  };

  useEffect(() => {
    if (contract) {
      fetchProducts();
    }
  }, [contract]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by batch number or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="registered">Registered</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Live Map View</h2>
        <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer
            center={[11.1271, 78.6569]} // Tamil Nadu coordinates
            zoom={7} // Adjusted zoom level to show Tamil Nadu state
            style={{ height: '100%', width: '100%' }}
            >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            {dummyProducts.map(product => (
              <Marker
                key={product.id}
                position={[product.location.lat, product.location.lng]}
              >
                <Popup>
                  <div>
                    <h3 className="font-semibold">{product.itemName}</h3>
                    <p>Batch: {product.batchNumber}</p>
                    <p>Status: {product.status}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {dummyBorderCrossings.map(crossing => (
              <Marker
                key={crossing.id}
                position={[crossing.location.lat, crossing.location.lng]}
              >
                <Popup>
                  <div>
                    <h3 className="font-semibold">{crossing.borderName}</h3>
                    <p>Officer: {crossing.officerName}</p>
                    <p>Status: {crossing.status}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Food Movement Tracking */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Food Movement Tracking</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                      {product.batchNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.itemName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.farmName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.quantity.toString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${product.status === 2 ? 'bg-green-100 text-green-800' :
                        product.status === 1 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {product.exists.toString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.batchNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Alerts & Notifications</h2>
        <div className="space-y-4">
        {filteredProducts
          .filter(product => product.quantity > 2000)
          .map((product) => (
          <tr key={product.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                {product.batchNumber}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {product.itemName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {product.farmName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {product.quantity.toString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${product.status === 2 ? 'bg-green-100 text-green-800' :
            product.status === 1 ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'}`}>
                {product.exists.toString()}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {product.batchNumber}
            </td>
          </tr>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;