import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../api";

export default function History() {
  const [calls, setCalls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/calls/history").then(d=>setCalls(d.calls)).catch(e=>setError(e.message));
  }, []);

  return <div><Navbar/><main className="dashboard"><section className="page-card">
    <p className="eyebrow">YOUR ACTIVITY</p><h1>Call History</h1>
    {error && <div className="error-box">{error}</div>}
    {!calls.length && !error && <p className="muted">No conversations yet.</p>}
    <div className="history-list">{calls.map(c=>{
      const me = JSON.parse(localStorage.getItem("boostUser")||"{}");
      const other = c.caller?.email === me.email ? c.partner : c.caller;
      return <div className="history-item" key={c._id}><div><strong>{other?.name || "Partner"}</strong><p>{c.status} · {Math.round((c.durationSeconds||0)/60)} min</p></div><span>★ {other?.rating?.toFixed?.(1)||"New"}</span></div>;
    })}</div>
  </section></main></div>;
}
