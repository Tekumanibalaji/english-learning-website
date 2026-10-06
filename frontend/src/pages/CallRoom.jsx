import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { api, SOCKET_URL, getToken } from "../api";
import Rating from "../components/Rating";

export default function CallRoom() {
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [peerReady, setPeerReady] = useState(false);
  const [error, setError] = useState("");
  const active = JSON.parse(localStorage.getItem("activeCall") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio:true, video:true });
        if (!mounted) return;
        localRef.current.srcObject = stream;

        const socket = io(SOCKET_URL, { auth:{ token:getToken() } });
        socketRef.current = socket;

        const pc = new RTCPeerConnection({
          iceServers: [{ urls:"stun:stun.l.google.com:19302" }]
        });
        pcRef.current = pc;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        pc.ontrack = e => { remoteRef.current.srcObject = e.streams[0]; };
        pc.onicecandidate = e => {
          if (e.candidate) socket.emit("ice-candidate", { roomId, candidate:e.candidate });
        };

        socket.on("peer-joined", async () => {
          setPeerReady(true);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("webrtc-offer", { roomId, offer });
        });

        socket.on("webrtc-offer", async ({offer}) => {
          setPeerReady(true);
          await pc.setRemoteDescription(offer);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("webrtc-answer", { roomId, answer });
        });

        socket.on("webrtc-answer", async ({answer}) => {
          await pc.setRemoteDescription(answer);
        });

        socket.on("ice-candidate", async ({candidate}) => {
          try { await pc.addIceCandidate(candidate); } catch {}
        });

        socket.on("peer-left", () => setPeerReady(false));
        socket.emit("join-room", { roomId });
        setStarted(true);
      } catch (e) {
        setError("Camera/microphone permission is required for the practice call.");
      }
    }
    setup();

    return () => {
      mounted = false;
      socketRef.current?.emit("leave-room", { roomId });
      socketRef.current?.disconnect();
      pcRef.current?.close();
      localRef.current?.srcObject?.getTracks().forEach(t=>t.stop());
    };
  }, [roomId]);

  async function endCall() {
    try {
      if (active.callId) await api(`/calls/${active.callId}/end`, {method:"POST"});
    } catch {}
    setEnded(true);
  }

  if (ended) return <main className="call-page"><section className="end-card">
    <p className="eyebrow">CONVERSATION COMPLETE</p><h1>Nice work!</h1>
    <p>Rate your partner and help improve the community.</p>
    <Rating partnerId={active.partnerId} callId={active.callId}/>
    <button className="secondary-btn" onClick={()=>navigate("/dashboard")}>Back to Dashboard</button>
  </section></main>;

  return <main className="call-page"><section className="call-card">
    <div className="call-top"><div><span className="status-dot"></span>{peerReady ? "Partner connected" : "Waiting for partner..."}</div>
      <button className="ghost-btn" onClick={async()=>{const reason=prompt("Reason for report?");if(reason) {try{await api("/safety/report",{method:"POST",body:JSON.stringify({userId:active.partnerId,reason})});alert("Report submitted.");}catch(e){alert(e.message)}}}}>Report</button>
    </div>
    {error && <div className="error-box">{error}</div>}
    <div className="video-grid">
      <video ref={remoteRef} autoPlay playsInline className="remote-video"/>
      <video ref={localRef} autoPlay muted playsInline className="local-video"/>
    </div>
    <div className="call-status">{started ? "Practice in English • Be respectful • Stay safe" : "Starting..."}</div>
    <div className="call-controls">
      <button className="control" onClick={()=>{const t=localRef.current?.srcObject?.getAudioTracks?.()[0];if(t)t.enabled=!t.enabled}}>🎙️</button>
      <button className="control" onClick={()=>{const t=localRef.current?.srcObject?.getVideoTracks?.()[0];if(t)t.enabled=!t.enabled}}>📷</button>
      <button className="control danger" onClick={endCall}>End Call</button>
    </div>
    <p className="call-note">Never share passwords, OTPs, financial information, or your private address. Report inappropriate behavior.</p>
  </section></main>;
}
