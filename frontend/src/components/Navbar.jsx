import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("boostToken");
    localStorage.removeItem("boostUser");
    navigate("/login");
  };

  return <nav className="navbar">
    <Link className="brand" to="/dashboard">Boost English</Link>
    <div className="nav-links">
      <Link to="/dashboard">Practice</Link>
      <Link to="/history">History</Link>
      <button className="ghost-btn" onClick={logout}>Log out</button>
    </div>
  </nav>;
}
