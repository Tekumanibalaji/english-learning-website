import { useState } from "react";
import { api } from "../api";

export default function Rating({ partnerId, callId }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);

  async function submit() {
    if (!rating) return alert("Please select a rating.");
    try {
      await api("/rating", {
        method: "POST",
        body: JSON.stringify({ to: partnerId, call: callId, rating, feedback })
      });
      setSent(true);
    } catch (e) {
      alert(e.message);
    }
  }

  if (sent) return <div className="success-box">Thanks! Your feedback was submitted.</div>;

  return <div className="rating-card">
    <h3>How was your conversation?</h3>
    <div className="stars">
      {[1,2,3,4,5].map(n =>
        <button className={n <= rating ? "star active" : "star"} key={n} onClick={() => setRating(n)}>★</button>
      )}
    </div>
    <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Optional feedback" />
    <button className="primary-btn" onClick={submit}>Submit Rating</button>
  </div>;
}
