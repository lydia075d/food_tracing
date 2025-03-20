import React, { useState } from 'react';
import { ethers } from 'ethers';
import QRCode from 'react-qr-code';

interface Product {
    qrData: string;
    farmName: string;
    location: string;
    itemName: string;
    quantity: string;
    productionDate: string;
    expiryDate: string;
    batchNumber: string;
}

const CONTRACT_ADDRESS = '0x4F9ccf89F6069f6EA6C86B1a445efB27425A2361';  // Replace with your contract address
const CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "batchNumber",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "farmName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            }
        ],
        "name": "ProductRegistered",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "batchCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "batchNumbers",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchNumber",
                "type": "string"
            }
        ],
        "name": "getProductByBatch",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "products",
        "outputs": [
            {
                "internalType": "string",
                "name": "farmName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "location",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "itemName",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "productionDate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "expiryDate",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "batchNumber",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "exists",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_farmName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_location",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_itemName",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_quantity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_productionDate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_expiryDate",
                "type": "uint256"
            }
        ],
        "name": "registerProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

function ProductRegistration() {
    const [formData, setFormData] = useState({
        farmName: '',
        location: '',
        itemName: '',
        quantity: '',
        productionDate: '',
        expiryDate: ''
    });

    const [products, setProducts] = useState<Product[]>([]);  // ✅ Add explicit typing
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!window.ethereum) {
                alert('MetaMask not detected');
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const productionTimestamp = new Date(formData.productionDate).getTime() / 1000;
            const expiryTimestamp = new Date(formData.expiryDate).getTime() / 1000;

            const tx = await contract.registerProduct(
                formData.farmName,
                formData.location,
                formData.itemName,
                parseInt(formData.quantity),
                productionTimestamp,
                expiryTimestamp
            );

            await tx.wait();

            // Generate batch number and QR data
            const newBatchNumber = `BATCH-${Date.now().toString().slice(-6)}`;
            const newProduct: Product = {   // ✅ Explicit typing for new product
                qrData: `https://yourtrackingurl.com?batch=${newBatchNumber}`,
                farmName: formData.farmName,
                location: formData.location,
                itemName: formData.itemName,
                quantity: formData.quantity,
                productionDate: formData.productionDate,
                expiryDate: formData.expiryDate,
                batchNumber: newBatchNumber
            };

            setProducts((prev) => [...prev, newProduct]);

            // Reset form
            setFormData({
                farmName: '',
                location: '',
                itemName: '',
                quantity: '',
                productionDate: '',
                expiryDate: ''
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Product Registration</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="farmName"
                        placeholder="Farm Name"
                        value={formData.farmName}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="text"
                        name="itemName"
                        placeholder="Item Name"
                        value={formData.itemName}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity (kg)"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="date"
                        name="productionDate"
                        value={formData.productionDate}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register Product'}
                    </button>
                </form>
            </div>

            <div className="w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">Registered Products</h3>
                <div className="space-y-4">
                    {products.length === 0 && <p>No products registered yet.</p>}
                    {products.map((product, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg p-4">
                            <h4 className="text-lg font-bold">{product.itemName}</h4>
                            <p><strong>Farm:</strong> {product.farmName}</p>
                            <p><strong>Location:</strong> {product.location}</p>
                            <p><strong>Quantity:</strong> {product.quantity} kg</p>
                            <p><strong>Production Date:</strong> {product.productionDate}</p>
                            <p><strong>Expiry Date:</strong> {product.expiryDate}</p>
                            <p><strong>Batch Number:</strong> {product.batchNumber}</p>
                            <div className="mt-2">
                                <QRCode value={product.qrData} size={128} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductRegistration;
