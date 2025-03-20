import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x7020fD02FC26D96F34C45364257487e574247FfE';  // Replace with the deployed contract address
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "username", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "email", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "number", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "wallet", "type": "address" }
    ],
    "name": "UserAdded",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_username", "type": "string" },
      { "internalType": "string", "name": "_email", "type": "string" },
      { "internalType": "uint256", "name": "_number", "type": "uint256" }
    ],
    "name": "addUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_wallet", "type": "address" }
    ],
    "name": "getUserByWallet",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function ProducerRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.addUser(
        formData.fullName,
        formData.email,
        parseInt(formData.phone)
      );

      await tx.wait();
      setMessage('✅ Producer registered successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const wallet = await signer.getAddress();
      const user = await contract.getUserByWallet(wallet);

      alert(`User Details:\nName: ${user[0]}\nEmail: ${user[1]}\nPhone: ${user[2]}`);
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Producer Registration</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="w-1/2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <button
            type="button"
            onClick={fetchUser}
            className="w-1/2 ml-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Verify Producer
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default ProducerRegistration;
