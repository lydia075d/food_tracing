import React, { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const CONTRACT_ADDRESS = "0x147D7E2ED524DC651083AAE516F4a14Bc73A9619"; // Replace with deployed contract address
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "role",
        "type": "string"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_number",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_password",
        "type": "string"
      }
    ],
    "name": "loginUser",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
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
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_password",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_number",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_role",
        "type": "string"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function Login() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    number: "",
    role: "Producer"
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const userExists = await contract.loginUser(formData.number, formData.password);
      
      if (userExists[0]) {
        setMessage("Login successful!");
        localStorage.setItem("userRole", userExists[1]);
        navigate("/product-registration");
      } else {
        setMessage("Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      await contract.registerUser(formData.name, formData.password, parseInt(formData.number), formData.role);

      setMessage("Registration successful! Now you can log in.");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Login / Register</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            name="number"
            placeholder="Phone Number"
            value={formData.number}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option>Producer</option>
            <option>Intermediate</option>
            <option>Gov Authority</option>
            <option>Distributor</option>
          </select>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            {loading ? "Logging in..." : "Login"}
          </button>

          <button type="button" onClick={handleRegister} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            {loading ? "Registering..." : "Register"}
          </button>

          <button type="button" onClick={connectWallet} className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
            Connect Wallet
          </button>
        </form>

        {message && <p className="text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
