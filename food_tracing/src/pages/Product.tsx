import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import FoodTraceabilityABI from '../abis/FoodTraceability.json';
import clsx from "clsx";

const CONTRACT_ADDRESS = "0xCBFA64B9551970350cd385EAC3765eD983B2056A";
const CONTRACT_ABI = FoodTraceabilityABI.abi ;

interface Product {
  itemName: string;
  batchNumber: string;
  status: number;
}

interface Movement {
  action: string;
  actor: string;
  location: string;
  timestamp: number;
}

export default function Product() {
  const [web3, setWeb3] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [tab, setTab] = useState("register");
  const [loading, setLoading] = useState(false);
  const [batchNumber, setBatchNumber] = useState("");
  const [borderLocation, setBorderLocation] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [movementHistory, setMovementHistory] = useState<Movement[]>([]);
  const [batchNumberHistory, setBatchNumberHistory] = useState("");
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("userRole"));
  const [loginData, setLoginData] = useState({
    name: "",
    password: "",
    number: "",
    role: "Producer"
  });

  // Role-based tab configuration
  const tabs = [
    { key: "register", label: "Register Product", roles: ["Producer", "Gov Authority"] },
    { key: "movement", label: "Track Movement", roles: ["Intermediate", "Distributor", "Gov Authority"] },
    { key: "history", label: "View History", roles: ["Gov Authority"] },
  ];

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      // Simulate login - replace with your contract logic
      const tx = await contract.registerUser(
        loginData.name,
        loginData.password,
        parseInt(loginData.number),
        loginData.role
      );
      
      await tx.wait();
      localStorage.setItem("userRole", loginData.role);
      setUserRole(loginData.role);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const registerProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const tx = await contract.registerProduct(
        formData.get("farmName"),
        formData.get("location"),
        formData.get("itemName"),
        formData.get("quantity"),
        Math.floor(new Date(formData.get("productionDate") as string).getTime() / 1000),
        Math.floor(new Date(formData.get("expiryDate") as string).getTime() / 1000)
      );
      
      await tx.wait();
      alert("Product registered successfully!");
      form.reset();
    } catch (error) {
      console.error("Registration error:", error);
      alert("Product registration failed");
    } finally {
      setLoading(false);
    }
  };

  const crossBorder = async () => {
    if (!contract) return;
    
    try {
      const tx = await contract.logBorderCrossing(batchNumber, borderLocation);
      await tx.wait();
      alert("Border crossing logged!");
    } catch (error) {
      console.error("Border crossing error:", error);
      alert("Failed to log border crossing");
    }
  };

  const distributorReceive = async () => {
    if (!contract) return;
    
    try {
      const tx = await contract.distributorReceive(batchNumber, "Distributor Location");
      await tx.wait();
      alert("Product received by distributor!");
    } catch (error) {
      console.error("Distribution error:", error);
      alert("Distribution failed");
    }
  };

  const splitAndAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const tx = await contract.splitAndAssignToSeller(
        batchNumber,
        formData.get("sellerAddress"),
        formData.get("sellerName"),
        formData.get("quantity")
      );
      
      await tx.wait();
      alert("Product split and assigned successfully!");
      form.reset();
    } catch (error) {
      console.error("Split error:", error);
      alert("Product split failed");
    }
  };

  const fetchProducts = async () => {
    if (!contract) return;
    
    try {
      const result = await contract.listAllProducts();
      setProducts(result);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch products");
    }
  };

  const fetchHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    
    try {
      const result = await contract.getMovementHistory(batchNumberHistory);
      setMovementHistory(result);
    } catch (error) {
      console.error("History error:", error);
      alert("Failed to fetch history");
    }
  };

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Login / Register</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              name="name"
              placeholder="Name"
              value={loginData.name}
              onChange={(e) => setLoginData({...loginData, name: e.target.value})}
              required
              className="w-full border rounded p-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required
              className="w-full border rounded p-2"
            />
            <input
              type="number"
              name="number"
              placeholder="Phone Number"
              value={loginData.number}
              onChange={(e) => setLoginData({...loginData, number: e.target.value})}
              required
              className="w-full border rounded p-2"
            />
            <select
              name="role"
              value={loginData.role}
              onChange={(e) => setLoginData({...loginData, role: e.target.value})}
              className="w-full border rounded p-2"
            >
              <option>Producer</option>
              <option>Intermediate</option>
              <option>Gov Authority</option>
              <option>Distributor</option>
            </select>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Login/Register"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🌾 Food Traceability dApp</h1>
        <div className="bg-gray-100 px-4 py-2 rounded-full text-sm">
          Connected as: <span className="font-medium">{account}</span> | Role: <span className="font-medium">{userRole}</span>
        </div>
      </div>

      <div className="flex gap-4">
        {tabs
          .filter(t => t.roles.includes(userRole))
          .map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={clsx(
                "px-4 py-2 rounded-full transition",
                tab === key ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              )}
            >
              {label}
            </button>
          ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Registration Tab */}
        {tab === "register" && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <form onSubmit={registerProduct} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">🧺 Register Product</h2>
              <input name="farmName" placeholder="Farm Name" required className="input mb-3" />
              <input name="location" placeholder="Location" required className="input mb-3" />
              <input name="itemName" placeholder="Item Name" required className="input mb-3" />
              <input name="quantity" type="number" placeholder="Quantity" required className="input mb-3" />
              <input name="productionDate" type="date" required className="input mb-3" />
              <input name="expiryDate" type="date" required className="input mb-3" />
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Registering..." : "Register Product"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Movement Tab */}
        {tab === "movement" && (
          <motion.div
            key="movement"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {(userRole === "Intermediate" || userRole === "Gov Authority") && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4">🚚 Border Crossing</h3>
                <input
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="Batch Number"
                  className="input mb-3"
                />
                <input
                  value={borderLocation}
                  onChange={(e) => setBorderLocation(e.target.value)}
                  placeholder="Border Location"
                  className="input mb-3"
                />
                <button 
                  onClick={crossBorder} 
                  disabled={loading}
                  className="btn-primary bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "Processing..." : "Log Border Crossing"}
                </button>
              </div>
            )}

            {(userRole === "Distributor" || userRole === "Gov Authority") && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4">📦 Distribution</h3>
                <form onSubmit={splitAndAssign} className="space-y-3">
                  <input name="sellerAddress" placeholder="Seller Address" required className="input" />
                  <input name="sellerName" placeholder="Seller Name" required className="input" />
                  <input name="quantity" type="number" placeholder="Quantity" required className="input" />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    {loading ? "Processing..." : "Split and Assign"}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {tab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-xl font-semibold mb-4">📜 Product History</h2>
            <form onSubmit={fetchHistory} className="mb-4">
              <input
                value={batchNumberHistory}
                onChange={(e) => setBatchNumberHistory(e.target.value)}
                placeholder="Batch Number"
                className="input mr-3"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:bg-gray-400"
              >
                {loading ? "Fetching..." : "Get History"}
              </button>
            </form>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Movement History</h3>
              <ul className="list-disc pl-6">
                {movementHistory.map((movement, index) => (
                  <li key={index} className="py-2">
                    <span className="font-medium">{movement.action}</span> -{" "}
                    {`${movement.actor} @ ${movement.location}`}
                    <span className="text-gray-500 text-sm block">
                      {new Date(Number(movement.timestamp) * 1000).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </motion.div>
      )}
    </div>
  );
}
