import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CallRoom from "./pages/CallRoom";
import History from "./pages/History";

function Private({ children }) {
  return localStorage.getItem("boostToken") ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/call/:roomId" element={<Private><CallRoom /></Private>} />
      <Route path="/history" element={<Private><History /></Private>} />
    </Routes>
  );
}
