import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

interface Product {
  _id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  categoryId: string;
  tags: string[];
  ratings: { average: number; count: number };
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function ProductPage() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string>("");
  const [tags, setTags] = useState<string>("");     // comma-separated
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get<Product[]>("http://localhost:5000/api/products/all"),
          axios.get<Category[]>("http://localhost:5000/api/categories/all"),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        if (catRes.data.length) setCategoryId(catRes.data[0]._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-4 text-white">Loading…</p>;

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("You must be logged in to add products.");
      return;
    }
    try {
      const payload = {
        sellerId: user.userId,
        name,
        description,
        price,
        stock,
        categoryId,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      };
      const res = await axios.post("http://localhost:5000/api/products/add", payload);
      setProducts([res.data, ...products]);
      // reset
      setName(""); setDescription(""); setPrice(0); setStock(0); setTags("");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add product.");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const updateProduct = async (p: Product) => {
    // simple prompts for fields
    const newName = prompt("New name:", p.name);
    if (!newName) return;
    const newDesc = prompt("New description:", p.description);
    if (newDesc === null) return;
    const newPrice = prompt("New price:", p.price.toString());
    if (newPrice === null) return;
    const newStock = prompt("New stock:", p.stock.toString());
    if (newStock === null) return;

    try {
      const payload = {
        name: newName,
        description: newDesc,
        price: parseFloat(newPrice),
        stock: parseInt(newStock, 10),
      };
      const res = await axios.put(`http://localhost:5000/api/products/${p._id}`, payload);
      setProducts(products.map(prod => (prod._id === p._id ? res.data : prod)));
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Create New Product */}
      <section className="bg-gray-800 p-6 rounded shadow text-white">
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        {error && <p className="text-red-400 mb-2">{error}</p>}
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ... same create form fields except images */}
          <div>
            <label className="block mb-1">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1">Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700"
            >
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 rounded bg-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1">Price (ZAR)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(+e.target.value)}
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 rounded bg-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={e => setStock(+e.target.value)}
              min="0"
              required
              className="w-full px-3 py-2 rounded bg-gray-700"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Tags (comma-separated)</label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. electronics, home"
              className="w-full px-3 py-2 rounded bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="md:col-span-2 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
          >
            Add Product
          </button>
        </form>
      </section>

      {/* Product List */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                  </h3>
                  <p className="text-gray-800 font-medium mb-2">
                  {product.currency} {product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  <p className="text-sm text-gray-500">In stock: {product.stock}</p>
                </div>
                <div className="mt-4 flex justify-center space-x-2">
                  <button
                    onClick={() => updateProduct(product)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-sm rounded">
                      Update
                    </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-sm rounded">
                      Delete
                    </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
