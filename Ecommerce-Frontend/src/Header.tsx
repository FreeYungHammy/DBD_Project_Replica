import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to ="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/users">Users</Link>
        <Link to="/cart">Cart</Link>
    </nav>
  );
}
