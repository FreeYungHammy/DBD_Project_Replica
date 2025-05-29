import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import type { FormEvent } from "react";

interface User {
  _id:     string;
  name:    string;
  email:   string;
  role:    string;
  createdAt: string;
}

export default function UserPage() {
  const { user: currentUser } = useUser();
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // form state for adding
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [role,  setRole]  = useState<"buyer"|"seller"|"admin">("buyer");

  // load all users
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<User[]>("http://localhost:5000/api/users/");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // add new user
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post<User>("http://localhost:5000/api/users", {
        name, email, password: "ChangeMe123!", role
      });
      setUsers([res.data, ...users]);
      setName(""); setEmail(""); setRole("buyer");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add user.");
    }
  };

  // delete user
  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch {
      setError("Failed to delete user.");
    }
  };

  // update user
  const updateUser = async (u: User) => {
    const newName = prompt("New name:", u.name);
    if (!newName) return;
    const newEmail = prompt("New email:", u.email);
    if (!newEmail) return;
    const newRole = prompt("New role (buyer/seller/admin):", u.role);
    if (!newRole || !["buyer", "seller", "admin"].includes(newRole)) return;

    try {
      const res = await axios.put<User>(
        `http://localhost:5000/api/users/${u._id}`,
        { name: newName, email: newEmail, role: newRole }
      );
      setUsers(users.map(x => x._id === u._id ? res.data : x));
    } catch {
      setError("Failed to update user.");
    }
  };

  if (loading) return <p className="p-4 text-white">Loading users…</p>;
  if (error)   return <p className="p-4 text-red-400">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Current user info */}
      <section className="bg-gray-800 p-6 rounded shadow text-white">
        <h2 className="text-2xl font-bold mb-2">Logged in as</h2>
        <p><strong>Name:</strong> {currentUser?.name}</p>
        <p><strong>Email:</strong> {currentUser?.email}</p>
        <p><strong>Role:</strong>  {currentUser?.role}</p>
      </section>

      {/* Add user form */}
      <section className="bg-gray-800 p-6 rounded shadow text-white">
        <h2 className="text-2xl font-bold mb-4">Add New User</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="px-3 py-2 rounded bg-gray-700"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="px-3 py-2 rounded bg-gray-700"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <select
            className="px-3 py-2 rounded bg-gray-700"
            value={role}
            onChange={e => setRole(e.target.value as any)}
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="md:col-span-3 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
          >
            Create User
          </button>
        </form>
      </section>

      {/* User list */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">All Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {users.map(u => (
            <div
              key={u._id}
              className="bg-white p-4 rounded shadow flex flex-col justify-between"
            >
              <div>
                <p className="font-semibold text-black">{u.name}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
                <p className="text-sm text-gray-500">Role: {u.role}</p>
                <p className="text-xs text-gray-400">
                  Joined {new Date(u.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  onClick={() => updateUser(u)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-sm rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteUser(u._id)}
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
