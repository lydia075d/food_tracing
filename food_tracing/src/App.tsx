// File: src/App.jsx
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import FoodTraceabilityABI from './abis/FoodTraceability.json';
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react"; // or any spinner
import clsx from "clsx";

const CONTRACT_ADDRESS = "0xCBFA64B9551970350cd385EAC3765eD983B2056A";

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [tab, setTab] = useState("register");
  const [loading, setLoading] = useState(false);
  const [batchNumber, setBatchNumber] = useState('');
  const [borderLocation, setBorderLocation] = useState('');
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
  const [products, setProducts] = useState<Product[]>([]);
  const [movementHistory, setMovementHistory] = useState<Movement[]>([]);
  const [batchNumberHistory, setBatchNumberHistory] = useState('');

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        const contractInstance = new web3Instance.eth.Contract(FoodTraceabilityABI.abi, CONTRACT_ADDRESS);

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setContract(contractInstance);
      } else {
        alert("Please install MetaMask");
      }
    }
    loadWeb3();
  }, []);

  const registerProduct = async (e: { preventDefault: () => void; target: any; }) => {
    e.preventDefault();
    const form = e.target;
    const tx = await contract.methods.registerProduct(
      form.farmName.value,
      form.location.value,
      form.itemName.value,
      form.quantity.value,
      Math.floor(new Date(form.productionDate.value).getTime() / 1000),
      Math.floor(new Date(form.expiryDate.value).getTime() / 1000)
    ).send({ from: account });

    alert("Product registered in transaction: " + tx.transactionHash);
  };

  const crossBorder = async () => {
    await contract.methods.logBorderCrossing(batchNumber, borderLocation).send({ from: account });
    alert("Border crossing logged");
  };

  const distributorReceive = async () => {
    await contract.methods.distributorReceive(batchNumber, "Distributor Location").send({ from: account });
    alert("Product received by distributor");
  };

  const splitAndAssign = async (e: { preventDefault: () => void; target: any; }) => {
    e.preventDefault();
    const form = e.target;
    await contract.methods.splitAndAssignToSeller(
      batchNumber,
      form.sellerAddress.value,
      form.sellerName.value,
      form.quantity.value
    ).send({ from: account });
    alert("Product split and assigned to seller");
  };

  const fetchProducts = async () => {
    const result = await contract.methods.listAllProducts().call();
    setProducts(result);
  };

  const fetchHistory = async (e: React.FormEvent) => {
    e.preventDefault(); // Add this line to prevent form submission
    const result = await contract.methods.getMovementHistory(batchNumberHistory).call();
    setMovementHistory(result);
  };
  
  const tabs = [
    { key: "register", label: "Register Product" },
    { key: "movement", label: "Track Movement" },
    { key: "history", label: "View History" },
  ];

  return (
    <div className="p-6 space-y-4">
    <h1 className="text-2xl font-bold text-center">🌾 Food Traceability dApp</h1>

    <div className="flex justify-center gap-4">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={clsx(
            "px-4 py-2 rounded-full transition",
            tab === key ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          )}
        >
          {label}
        </button>
      ))}
    </div>

    <AnimatePresence mode="wait">
      {tab === "register" && (
        <motion.div
          key="register"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="flex justify-center">
  <form
    onSubmit={registerProduct}
    className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-4"
  >
    <h2 className="text-xl font-semibold text-center text-gray-800 ">
      🧺 Register Product
    </h2>

    <input
      name="farmName"
      placeholder="Farm Name"
      required
      className="input"
    />
    <input
      name="location"
      placeholder="Location"
      required
      className="input"
    />
    <input
      name="itemName"
      placeholder="Item Name"
      required
      className="input"
    />
    <input
      name="quantity"
      placeholder="Quantity"
      type="number"
      required
      className="input"
    />
    <input
      name="productionDate"
      placeholder="Production Date"
      type="date"
      required
      className="input"
    />
    <input
      name="expiryDate"
      placeholder="Expiry Date"
      type="date"
      required
      className="input"
    />

    <button type="submit" className="btn bg-slate-300 rounded-lg h-12 font-bold text-xl w-full">
      Register
    </button>
  </form>
</div>

        </motion.div>
      )}

      {tab === "movement" && (
       <motion.div
       key="movement"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -20 }}
       transition={{ duration: 0.3 }}
       className="flex justify-center"
     >
       <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md space-y-6">
         <h2 className="text-xl font-semibold text-center text-gray-800">🚚 Product Movement</h2>
     
         <div className="space-y-3">
           <input
             placeholder="Batch Number"
             value={batchNumber}
             onChange={(e) => setBatchNumber(e.target.value)}
             className="input"
           />
           <input
             placeholder="Border Location"
             value={borderLocation}
             onChange={(e) => setBorderLocation(e.target.value)}
             className="input"
           />
     
           <div className="flex flex-col sm:flex-row gap-3">
             <button onClick={crossBorder} className="btn w-full sm:w-auto">
               Log Border Crossing
             </button>
             <button onClick={distributorReceive} className="btn w-full sm:w-auto">
               Distributor Receive
             </button>
           </div>
         </div>
     
         <form onSubmit={splitAndAssign} className="space-y-3">
           <h3 className="text-md font-semibold text-gray-700">👨‍🌾 Assign to Seller</h3>
           <input name="sellerAddress" placeholder="Seller Address" required className="input" />
           <input name="sellerName" placeholder="Seller Name" required className="input" />
           <input name="quantity" placeholder="Quantity" type="number" required className="input" />
           <button type="submit" className="btn w-full">Split and Assign</button>
         </form>
     
         <button onClick={fetchProducts} className="btn w-full">📦 View All Products</button>
     
         <div className="space-y-2">
           <h3 className="text-md font-semibold text-gray-700">📋 Registered Products</h3>
           <ul className="list-disc pl-6 text-sm text-gray-600">
             {products.map((p, i) => (
               <li key={i}>
                 <span className="font-medium">{p.itemName}</span> - Batch: {p.batchNumber} - Status: {Object.keys(p.status)[p.status]}
               </li>
             ))}
           </ul>
         </div>
       </div>
     </motion.div>
     
      )}

      {tab === "history" && (
        <motion.div
  key="history"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
  className="flex justify-center"
>
  <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md space-y-6">
    <h2 className="text-xl font-semibold text-center text-gray-800">
      📜 Product History
    </h2>

    <form onSubmit={fetchHistory} className="space-y-3">
      <input
        placeholder="Enter Batch Number"
        value={batchNumberHistory}
        onChange={(e) => setBatchNumberHistory(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn w-full">Get Product History</button>
    </form>

    <div>
      <h3 className="text-md font-semibold text-gray-700 mb-2">🕓 Movement History</h3>
      <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
        {movementHistory.length > 0 ? (
          movementHistory.map((movement, index) => (
            <li key={index}>
              <span className="font-medium">{movement.action}</span> - 
              {` ${movement.actor} @ ${movement.location} `}
              <span className="text-gray-500">
                ({new Date(Number.parseInt(movement.timestamp.toString()) * 1000).toLocaleString()})
              </span>              
            </li>
          ))
        ) : (
          <li className="italic text-gray-500">No history found for this batch.</li>
        )}
      </ul>
    </div>
  </div>
</motion.div>

      )}
    </AnimatePresence>

    {loading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </motion.div>
    )}
  </div>
  );
}

export default App;