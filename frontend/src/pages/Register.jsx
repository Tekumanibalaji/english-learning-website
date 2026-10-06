import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name:"", email:"", mobile:"", password:"",
    role:"beginner", gender:"prefer_not_to_say", partnerGender:"any"
  });
  const navigate = useNavigate();
  const update = (key, value) => setForm(f => ({...f, [key]:value}));

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await api("/auth/register", { method:"POST", body:JSON.stringify(form) });
      localStorage.setItem("boostToken", data.token);
      localStorage.setItem("boostUser", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch(e) { alert(e.message); }
  }

  return <main className="auth-page">
    <section className="auth-card wide-card">
      <div className="logo-mark">B</div>
      <p className="eyebrow">JOIN THE COMMUNITY</p>
      <h1>Create account</h1>
      <p className="subtitle">Your public profile shows your display name. Keep private information private.</p>
      <form onSubmit={submit}>
        <label>Display name</label><input required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Your name" />
        <label>Email</label><input type="email" required value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com" />
        <label>Mobile</label><input required value={form.mobile} onChange={e=>update("mobile",e.target.value)} placeholder="+91..." />
        <label>Password</label><input type="password" minLength="8" required value={form.password} onChange={e=>update("password",e.target.value)} placeholder="At least 8 characters" />
        <label>I want to join as</label>
        <select value={form.role} onChange={e=>update("role",e.target.value)}><option value="beginner">Beginner / Learner</option><option value="fluent">Fluent Speaker / Helper</option></select>
        <label>My gender</label>
        <select value={form.gender} onChange={e=>update("gender",e.target.value)}><option value="prefer_not_to_say">Prefer not to say</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
        <label>Preferred partner</label>
        <select value={form.partnerGender} onChange={e=>update("partnerGender",e.target.value)}><option value="any">Anyone</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
        <button className="primary-btn wide">Create account</button>
      </form>
      <p className="tiny">By joining, you agree to respectful communication and safety rules. <Link to="/login">Already have an account?</Link></p>
    </section>
  </main>;
}
