import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem("boostToken", data.token);
      localStorage.setItem("boostUser", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (e) { alert(e.message); }
  }

  return <main className="auth-page">
    <section className="auth-card">
      <div className="logo-mark">B</div>
      <p className="eyebrow">SPEAK • PRACTICE • IMPROVE</p>
      <h1>Welcome back</h1>
      <p className="subtitle">Talk with people, practice English and build confidence.</p>
      <form onSubmit={submit}>
        <label>Email</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" />
        <button className="primary-btn wide">Log in</button>
      </form>
      <p className="tiny">New here? <Link to="/register">Create an account</Link></p>
    </section>
  </main>;
}
