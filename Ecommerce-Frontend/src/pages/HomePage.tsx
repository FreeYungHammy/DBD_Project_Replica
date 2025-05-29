import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-white">Welcome to the Etsy Inspired Application</h1>
      <p className="text-gray-300 mb-10">
        Your all-in-one dashboard for managing products, orders, users, and more.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NavLink
          to="/products"
          className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Products</h2>
          <p className="text-sm text-gray-600">View and manage all products.</p>
        </NavLink>

        <NavLink
          to="/categories"
          className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Categories</h2>
          <p className="text-sm text-gray-600">Organize products by category.</p>
        </NavLink>

        <NavLink
          to="/orders"
          className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Orders</h2>
          <p className="text-sm text-gray-600">Review recent orders.</p>
        </NavLink>

        <NavLink
          to="/cart"
          className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Carts</h2>
          <p className="text-sm text-gray-600">See active customer carts.</p>
        </NavLink>

        <NavLink
          to="/reviews"
          className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Reviews</h2>
          <p className="text-sm text-gray-600">View product reviews.</p>
        </NavLink>

        <NavLink
          to="/users"
          className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          <p className="text-sm text-gray-600">Manage customer accounts.</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Home;
