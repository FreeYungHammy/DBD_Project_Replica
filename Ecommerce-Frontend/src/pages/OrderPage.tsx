import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

interface OrderItem {
  productId: string;
  name:      string;
  quantity:  number;
  price:     number;
}

interface Order {
  _id:            string;
  userId:         string;
  items:          OrderItem[];
  status:         string;
  paymentMethod:  string;
  total:          number;
  createdAt:      string;
}

export default function OrderPage() {
  const { user } = useUser();
  const userId    = user?.userId;
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<Order[]>("http://localhost:5000/api/orders/all");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="p-4 text-white">Loading orders…</p>;
  if (error)   return <p className="p-4 text-red-400">{error}</p>;

  // split into “My Orders” and the rest
  const myOrders  = orders.filter(o => o.userId === userId);
  const otherOrders = orders.filter(o => o.userId !== userId);

  const renderOrderCard = (o: Order) => (
    <div key={o._id} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between">
        <p className="text-sm text-gray-500">Order ID: {o._id}</p>
        <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
      </div>
      <ul className="space-y-2">
        {o.items.map(item => (
          <li key={item.productId} className="flex justify-between">
            <span className="font-medium text-black">{item.name} x{item.quantity}</span>
            <span className="text-gray-700">{(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-black">Total:</span>
        <span className="font-bold text-black">ZAR {o.total.toFixed(2)}</span>
      </div>
      <div className="flex space-x-4 text-sm">
        <span className="px-2 py-1 bg-gray-200 rounded text-black">Status: {o.status}</span>
        <span className="px-2 py-1 bg-gray-200 rounded text-black">Pay: {o.paymentMethod}</span>
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-white">My Orders</h1>
      {myOrders.length
        ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myOrders.map(renderOrderCard)}
          </div>
        : <p className="text-gray-300">You have no orders yet.</p>
      }

      <h2 className="text-2xl font-bold text-white">All Orders</h2>
      {otherOrders.length
        ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherOrders.map(renderOrderCard)}
          </div>
        : <p className="text-gray-300">No other orders found.</p>
      }
    </main>
  );
}
