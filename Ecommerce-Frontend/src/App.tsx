import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import Header from "./Header";
import { UserProvider } from "./pages/UserContext";

import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import OrderPage from "./pages/OrderPage";
import UserPage from "./pages/UserPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import ReviewPage from "./pages/ReviewPage";

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const hideNav = pathname === "/login";

  return (
    <>
      {!hideNav && <Header />}
      <main className={hideNav ? "" : "pt-16"}>
        {children}
      </main>
    </>
  );
}

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <div className="max-w-7xl mx-auto pt-20 pb-10 px-4">
                  <h1 className="text-4xl font-bold mb-6 text-white">
                    Welcome to the Etsy Inspired Replica
                  </h1>
                  <p className="text-gray-300 mb-10">
                    Your all-in-one dashboard for managing products, orders, users,
                    and more.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    <Link
                      to="/products"
                      className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
                    >
                      <h2 className="text-lg font-semibold mb-2">Products</h2>
                      <p className="text-sm text-gray-600">
                        View and manage all products.
                      </p>
                    </Link>
                    <Link
                      to="/categories"
                      className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
                    >
                      <h2 className="text-lg font-semibold mb-2">
                        Categories
                      </h2>
                      <p className="text-sm text-gray-600">
                        Organize products by category.
                      </p>
                    </Link>
                    <Link
                      to="/orders"
                      className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
                    >
                      <h2 className="text-lg font-semibold mb-2">Orders</h2>
                      <p className="text-sm text-gray-600">
                        Review recent orders.
                      </p>
                    </Link>
                    <Link
                      to="/cart"
                      className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
                    >
                      <h2 className="text-lg font-semibold mb-2">Cart</h2>
                      <p className="text-sm text-gray-600">
                        See active customer carts.
                      </p>
                    </Link>
                    <Link
                      to="/reviews"
                      className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
                    >
                      <h2 className="text-lg font-semibold mb-2">Reviews</h2>
                      <p className="text-sm text-gray-600">
                        View product reviews.
                      </p>
                    </Link>
                    <Link
                      to="/users"
                      className="p-6 bg-white shadow rounded hover:bg-gray-100 transition block"
                    >
                      <h2 className="text-lg font-semibold mb-2">Users</h2>
                      <p className="text-sm text-gray-600">
                        Manage customer accounts.
                      </p>
                    </Link>
                  </div>
                </div>
              }
            />

            <Route path="/products"   element={<ProductPage />} />
            <Route path="/orders"     element={<OrderPage  />} />
            <Route path="/users"      element={<UserPage   />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/cart"       element={<CartPage    />} />
            <Route path="/reviews"    element={<ReviewPage  />} />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  );
};

export default App;
