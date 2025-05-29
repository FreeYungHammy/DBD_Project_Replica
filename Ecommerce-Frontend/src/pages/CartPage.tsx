import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

interface Product {
  _id:      string;
  name:     string;
  price:    number;
  currency: string;
}

interface CartItem {
  productId: string;
  quantity:  number;
}

export default function CartPage() {
  const { user } = useUser();
  const userId    = user?.userId ?? "";

  // State
  const [products,  setProducts]  = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [message,   setMessage]   = useState("");

  // Load all products + existing cart
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const pReq = axios.get<Product[]>("http://localhost:5000/api/products/all");
        const cReq = axios
          .get<{ cart?: { items: CartItem[] } }>(`http://localhost:5000/api/cart/${userId}`)
          .catch(err => {
            if (err.response?.status === 404) {
              // no cart yet
              return { data: { cart: { items: [] } } };
            }
            throw err;
          });

        const [pRes, cRes] = await Promise.all([pReq, cReq]);
        setProducts(pRes.data);

        // map items → { productId: qty }
        const map: Record<string, number> = {};
        (cRes.data.cart?.items || []).forEach(i => {
          map[i.productId] = i.quantity;
        });
        setCartItems(map);
      } catch (err) {
        console.error(err);
        setError("Failed to load products or cart.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  // Helpers to sync cart to server
  const saveCart = async (newMap: Record<string, number>) => {
    const items: CartItem[] = Object.entries(newMap).map(([pid, qty]) => ({
      productId: pid,
      quantity: qty,
    }));
    try {
      await axios.post("http://localhost:5000/api/cart/add", { userId, items });
      setCartItems(newMap);
    } catch {
      setError("Failed to update cart.");
    }
  };

  const inc = (pid: string) => saveCart({ ...cartItems, [pid]: (cartItems[pid] || 0) + 1 });
  const dec = (pid: string) => {
    const next = (cartItems[pid] || 0) - 1;
    if (next <= 0) {
      const { [pid]: _, ...rest } = cartItems;
      saveCart(rest);
    } else {
      saveCart({ ...cartItems, [pid]: next });
    }
  };

  const clearAll = async () => {
    if (!confirm("Clear your entire cart?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/cart/${userId}`);
      setCartItems({});
    } catch {
      setError("Failed to clear cart.");
    }
  };

  // Calculate total
  const total = Object.entries(cartItems).reduce((sum, [pid, qty]) => {
    const p = products.find(x => x._id === pid);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  // Checkout / place order
  const handleCheckout = async () => {
    if (!userId) {
      setError("Please log in to place an order.");
      return;
    }
    if (total === 0) {
      setError("Your cart is empty.");
      return;
    }

    setError("");
    try {
      const items = Object.entries(cartItems).map(([pid, qty]) => {
        const p = products.find(x => x._id === pid)!;
        return { productId: pid, name: p.name, quantity: qty, price: p.price };
      });

      const orderPayload = {
        userId,
        items,
        paymentMethod: "Cash on Delivery", 
        total,
        shippingAddress: {},               
      };

      await axios.post("http://localhost:5000/api/orders/add", orderPayload);
      setMessage("Order Complete! Payment occurs on delivery. Check your Orders page.");
      setCartItems({});
    } catch {
      setError("Failed to place order.");
    }
  };

  // Early returns
  if (!userId) {
    return <p className="p-4 text-white">Please log in to view your cart.</p>;
  }
  if (loading) {
    return <p className="p-4 text-white">Loading cart…</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white">Your Cart</h1>
      {error   && <p className="text-red-400">{error}</p>}
      {message && <p className="text-green-400">{message}</p>}

      <div className="flex space-x-4">
        <button
          onClick={clearAll}
          disabled={!Object.keys(cartItems).length}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Clear Cart
        </button>
        <button
          onClick={handleCheckout}
          disabled={!Object.keys(cartItems).length}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Checkout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => {
          const qty = cartItems[p._id] || 0;
          return (
            <div
              key={p._id}
              className="bg-white p-4 rounded-lg shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-gray-700 mb-2">
                  {p.currency} {p.price.toFixed(2)}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-4">
                <button
                  onClick={() => dec(p._id)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  –
                </button>
                <span className="text-lg font-medium text-gray-900">{qty}</span>
                <button
                  onClick={() => inc(p._id)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-right">
        <span className="text-xl font-semibold text-white">
          Total: {products[0]?.currency} {total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
