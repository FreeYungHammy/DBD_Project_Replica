import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import type { FormEvent } from "react";

interface Category {
  _id: string;
  name: string;
  createdAt?: string;
}

export default function CategoryPage() {
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [newName, setNewName] = useState("");
  const [error, setError]     = useState("");

  // load categories
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<Category[]>("http://localhost:5000/api/categories/all");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-4 text-white">Loading categories…</p>;

  // create
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("You must be logged in to add categories.");
      return;
    }
    try {
      const res = await axios.post<Category>(
        "http://localhost:5000/api/categories/add",
        { name: newName }
      );
      setCategories([res.data, ...categories]);
      setNewName("");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add category.");
    }
  };

  // delete
  const deleteCat = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  // update
  const updateCat = async (c: Category) => {
    const name = prompt("New category name:", c.name);
    if (!name) return;
    try {
      const res = await axios.put<Category>(
        `http://localhost:5000/api/categories/${c._id}`,
        { name }
      );
      setCategories(categories.map(x => x._id === c._id ? res.data : x));
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Add Category */}
      <section className="bg-gray-800 p-6 rounded shadow text-white">
        <h2 className="text-2xl font-bold mb-4">Add Category</h2>
        {error && <p className="text-red-400 mb-2">{error}</p>}
        <form onSubmit={handleAdd} className="flex space-x-2">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Category name"
            required
            className="flex-1 px-3 py-2 rounded bg-gray-700"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Add
          </button>
        </form>
      </section>

      {/* Category List */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(c => (
            <div
              key={c._id}
              className="bg-white p-4 rounded-lg shadow flex flex-col justify-between"
            >
              <span className="text-lg font-semibold text-gray-900">
                {c.name}
              </span>
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  onClick={() => updateCat(c)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-sm rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteCat(c._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-sm rounded"
                >
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
