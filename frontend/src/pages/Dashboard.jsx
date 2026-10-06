import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";

export default function Dashboard() {
  const [partner, setPartner] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("boostUser") || "{}");

  async function findPartner() {
    setBusy(true);
    try {
      const data = await api("/match");
      setPartner(data.partner);
    } catch(e) { alert(e.message); }
    finally { setBusy(false); }
  }

  async function startCall() {
    try {
      const data = await api("/calls/start", {
        method:"POST",
        body:JSON.stringify({ partnerId:partner.id })
      });
      localStorage.setItem("activeCall", JSON.stringify({ callId:data.callId, partnerId:partner.id }));
      navigate(`/call/${data.roomId}`);
    } catch(e) { alert(e.message); }
  }

  return <div><Navbar/><main className="dashboard">
    <section className="hero">
      <div><p className="eyebrow">BOOST ENGLISH</p>
        <h1>Speak English without fear.</h1>
        <p>Practice with a compatible English partner. Your contact details stay private.</p>
        <button className="primary-btn" disabled={busy} onClick={findPartner}>{busy ? "Finding..." : "Find My English Partner"}</button>
      </div>
      <div className="hero-orb">BE</div>
    </section>

    <section className="rules">
      <div><strong>01</strong><span>English-only practice</span></div>
      <div><strong>02</strong><span>Choose a comfortable partner</span></div>
      <div><strong>03</strong><span>Rate after every call</span></div>
    </section>

    {partner && <section className="partner-card">
      <div className="avatar">{partner.name[0]}</div>
      <div className="partner-info"><p className="eyebrow">MATCH FOUND</p><h2>{partner.name}</h2><p>{partner.role === "fluent" ? "Fluent Speaker" : "English Learner"} · ★ {partner.rating?.toFixed?.(1) || "New"}</p></div>
      <button className="primary-btn" onClick={startCall}>Start Conversation</button>
    </section>}

    <section className="info-grid">
      <article><span>🎯</span><h3>Improve fluency</h3><p>Practice natural conversation instead of only memorizing grammar.</p></article>
      <article><span>🤝</span><h3>Respectful matching</h3><p>Partner preferences can help you choose a comfortable conversation.</p></article>
      <article><span>🛡️</span><h3>Safety first</h3><p>Never share passwords, OTPs, financial details or your private address.</p></article>
    </section>

    <div className="safety-banner"><strong>Community rule:</strong> English practice only, respectful behavior always. Use Report/Block if anyone makes you uncomfortable.</div>
  </main></div>;
}
