/**
 * The Debate Engine — Main App (Arbiter redesign)
 *
 * Layout (card widget, max-width 1100px):
 *   ┌─────────────────────────────────────────────────┐
 *   │  NAV — ARBITER. wordmark + subtitle              │
 *   ├─────────────────────────────────────────────────┤
 *   │  MOTION BAR — input + DEBATE button              │
 *   ├──────────────────┬──────────┬────────────────────┤
 *   │  FOR selector    │  GROUP   │  AGAINST selector  │  ← personality header
 *   ├──────────────────┼──────────┼────────────────────┤
 *   │  Turn 1 card     │  1px div │                    │
 *   │  Turn 3 card     │          │  Turn 2 card       │
 *   │  Turn 5 card     │          │  Turn 4 / 6 card   │
 *   ├──────────────────┴──────────┴────────────────────┤
 *   │  ARBITER'S RULING                                 │
 *   ├─────────────────────────────────────────────────┤
 *   │  STATUS BAR — dot + text + turn pips             │
 *   └─────────────────────────────────────────────────┘
 */

import { useState, useRef, useEffect } from "react";
import Ticker          from "./components/Ticker.jsx";
import DebaterPanel    from "./components/DebaterPanel.jsx";
import GroupSelector   from "./components/GroupSelector.jsx";
import ArgumentCard    from "./components/ArgumentCard.jsx";
import VerdictCard     from "./components/VerdictCard.jsx";
import Logo            from "./components/Logo.jsx";
import { GROUPS, DEFAULT_FOR_ID, DEFAULT_AGAINST_ID } from "./constants/personalities.js";

// Which side speaks next, indexed by turns.length (3 rounds = 6 turns)
const NEXT_SPEAKER = {
  0: { side: "for",     label: "preparing opening argument" },
  1: { side: "against", label: "preparing challenge" },
  2: { side: "for",     label: "preparing rebuttal" },
  3: { side: "against", label: "preparing counter-rebuttal" },
  4: { side: "for",     label: "preparing closing argument" },
  5: { side: "against", label: "preparing final counter" },
};

export default function App() {
  // ── Debate state ───────────────────────────────────────────────────────────
  const [status,   setStatus]   = useState("idle");
  const [claim,    setClaim]    = useState("");
  const [debaters, setDebaters] = useState(null);
  const [turns,    setTurns]    = useState([]);
  const [verdict,  setVerdict]  = useState(null);
  const [ticker,   setTicker]   = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ── Personality state ──────────────────────────────────────────────────────
  const [forPersonalityId,     setForPersonalityId]     = useState(DEFAULT_FOR_ID);
  const [againstPersonalityId, setAgainstPersonalityId] = useState(DEFAULT_AGAINST_ID);
  const [selectedGroupId,      setSelectedGroupId]      = useState(null);

  const scrollRef = useRef(null);
  const latestRef = useRef(null);

  // Auto-scroll latest turn into view
  useEffect(() => {
    if (!latestRef.current || !scrollRef.current) return;
    scrollRef.current.scrollTo({ top: latestRef.current.offsetTop - 12, behavior: "smooth" });
  }, [turns.length]);

  // Scroll to verdict when it arrives
  useEffect(() => {
    if (!verdict || !scrollRef.current) return;
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 100);
  }, [verdict]);

  // ── Group selection — clears individual picks ──────────────────────────────
  const handleGroupChange = (groupId) => {
    setSelectedGroupId(groupId);
  };

  // ── Derived group roles for the header display ─────────────────────────────
  const activeGroup    = selectedGroupId ? GROUPS.find(g => g.id === selectedGroupId) : null;
  const forGroupRole   = activeGroup?.forRole    ?? null;
  const againstGroupRole = activeGroup?.againstRole ?? null;

  // ── Run debate ─────────────────────────────────────────────────────────────
  const runDebate = async () => {
    if (!claim.trim() || claim.trim().length < 10) return;
    setStatus("loading");
    setDebaters(null); setTurns([]); setVerdict(null); setTicker(null); setErrorMsg("");

    try {
      const body = { claim: claim.trim() };
      if (selectedGroupId) {
        body.groupId = selectedGroupId;
      } else {
        body.forPersonalityId     = forPersonalityId;
        body.againstPersonalityId = againstPersonalityId;
      }

      const res = await fetch("/debate-engine/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to start debate.");
      const { debateId } = await res.json();
      setStatus("debating");

      const es = new EventSource(`/debate-engine/api/debate/${debateId}/stream`);
      es.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if      (d.type === "identities") setDebaters({ proposer: d.proposer, challenger: d.challenger });
        else if (d.type === "turn")       setTurns((prev) => [...prev, d]);
        else if (d.type === "ticker")     setTicker(d.headline);
        else if (d.type === "verdict")    setVerdict(d);
        else if (d.type === "done")       { setStatus("complete"); es.close(); }
        else if (d.type === "error")      { setErrorMsg(d.message); setStatus("error"); es.close(); }
      };
      es.onerror = () => { setErrorMsg("Connection lost. Please try again."); setStatus("error"); es.close(); };
    } catch (err) { setErrorMsg(err.message); setStatus("error"); }
  };

  const reset = () => {
    setStatus("idle"); setClaim(""); setDebaters(null);
    setTurns([]); setVerdict(null); setTicker(null); setErrorMsg("");
    // Personalities persist — user keeps their selections for the next debate
  };

  const isLive   = status === "debating" || status === "loading";
  const isActive = isLive || status === "complete";
  const nextSpeaker = status === "debating" ? NEXT_SPEAKER[turns.length] : null;

  // Status bar text
  const statusText = {
    idle:     "READY · ENTER A MOTION ABOVE TO BEGIN",
    loading:  "FILING CASE…",
    debating: `LIVE · TURN ${turns.length + 1} OF 6 · ROUND ${Math.floor(turns.length / 2) + 1} OF 3`,
    complete: "DEBATE COMPLETE · 6 TURNS · 3 ROUNDS · SSE STREAM CLOSED",
    error:    errorMsg ? `ERROR · ${errorMsg.toUpperCase()}` : "ERROR · PLEASE TRY AGAIN",
  }[status] || "";

  return (
    // Page background — burnt sienna tertiary gradient
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 20px",
      background: `
        radial-gradient(ellipse at 72% 18%, rgba(200,90,20,0.28) 0%, transparent 52%),
        radial-gradient(ellipse at 16% 82%, rgba(150,55,10,0.22) 0%, transparent 48%),
        linear-gradient(148deg, #0e0503 0%, #1e0c06 32%, #2e1509 58%, #1a0a04 82%, #0a0302 100%)
      `,
      backgroundAttachment: "fixed",
    }}>

      {/* App card */}
      <div style={{
        width: "100%", maxWidth: "1100px",
        background: "#f0f4f8",
        borderRadius: "12px",
        overflow: "hidden",
        border: "0.5px solid #c8d4e0",
        boxShadow: "0 4px 32px rgba(20,40,70,0.12)",
        color: "#1a2a3a",
      }}>

        {/* ── Nav ────────────────────────────────────────────────────────── */}
        <nav style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 0 16px", background: "#e4edf5", borderBottom: "0.5px solid #c8d4e0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Logo size={32} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 700, letterSpacing: "0.07em", color: "#1a2a3a" }}>
              ARBITER<span style={{ color: "#3a8fc8" }}>.</span>
            </div>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", color: "#3a6a8a" }}>
            SEQUENTIAL MULTI-AGENT DEBATE ENGINE
          </div>
        </nav>

        {/* ── Motion bar ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px 24px", background: "#e8f0f8", borderBottom: "0.5px solid #c8d4e0" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", padding: "4px 10px", borderRadius: "4px", background: "#3a8fc8", color: "#fff", flexShrink: 0 }}>
            MOTION
          </div>
          <input
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!isLive) runDebate(); } }}
            placeholder="State your proposition…"
            disabled={isLive}
            style={{
              flex: 1, fontFamily: "'Playfair Display', serif", fontStyle: "italic",
              fontSize: "15px", color: "#1a2a3a", background: "transparent",
              border: "none", outline: "none", opacity: isLive ? 0.6 : 1,
            }}
          />
          {(status === "complete" || status === "error") ? (
            <button onClick={reset} style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", padding: "8px 20px", borderRadius: "5px", border: "none", background: "#3a8fc8", color: "#fff", cursor: "pointer", flexShrink: 0 }}>
              NEW DEBATE
            </button>
          ) : (
            <button
              onClick={runDebate}
              disabled={claim.trim().length < 10 || isLive}
              style={{
                fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.12em",
                padding: "8px 20px", borderRadius: "5px", border: "none", flexShrink: 0,
                background: claim.trim().length >= 10 && !isLive ? "#1a2a3a" : "#c8d4e0",
                color:      claim.trim().length >= 10 && !isLive ? "#fff"    : "#8aacca",
                cursor:     claim.trim().length >= 10 && !isLive ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              DEBATE
            </button>
          )}
        </div>

        {/* ── Personality header — 3 col grid ────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 1fr" }}>
          <DebaterPanel
            debater={debaters?.proposer}
            side="for"
            personalityId={forPersonalityId}
            onPersonalityChange={setForPersonalityId}
            groupRole={forGroupRole}
            isLive={isLive}
          />
          <GroupSelector
            selectedGroupId={selectedGroupId}
            onGroupChange={handleGroupChange}
            isStarted={isActive}
          />
          <DebaterPanel
            debater={debaters?.challenger}
            side="against"
            personalityId={againstPersonalityId}
            onPersonalityChange={setAgainstPersonalityId}
            groupRole={againstGroupRole}
            isLive={isLive}
          />
        </div>

        {/* ── Ticker ─────────────────────────────────────────────────────── */}
        <Ticker headline={ticker} />

        {/* ── Arena (visible while active) ───────────────────────────────── */}
        {isActive && (
          <div ref={scrollRef} style={{ maxHeight: "540px", overflowY: "auto", overflowX: "hidden" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", minHeight: "460px" }}>

              {/* FOR column */}
              <div>
                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px", background: "#f0f4f8" }}>
                  {turns.filter(t => t.side === "for").map(turn => {
                    const isLatest = turns[turns.length - 1]?.turnNumber === turn.turnNumber;
                    return (
                      <div key={turn.turnNumber} ref={isLatest ? latestRef : null}>
                        <ArgumentCard turn={turn} />
                      </div>
                    );
                  })}
                  {status === "debating" && nextSpeaker?.side === "for" && (
                    <StreamingPill
                      name={debaters?.proposer?.name || "Proposer"}
                      label={nextSpeaker.label}
                      color="#c87830"
                    />
                  )}
                </div>
              </div>

              {/* Center divider */}
              <div style={{ background: "#c8d4e0" }} />

              {/* AGAINST column */}
              <div>
                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px", background: "#d8eaf5" }}>
                  {turns.filter(t => t.side === "against").map(turn => {
                    const isLatest = turns[turns.length - 1]?.turnNumber === turn.turnNumber;
                    return (
                      <div key={turn.turnNumber} ref={isLatest ? latestRef : null}>
                        <ArgumentCard turn={turn} />
                      </div>
                    );
                  })}
                  {status === "debating" && nextSpeaker?.side === "against" && (
                    <StreamingPill
                      name={debaters?.challenger?.name || "Challenger"}
                      label={nextSpeaker.label}
                      color="#2278b8"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Arbiter deliberating */}
            {status === "debating" && turns.length === 6 && !verdict && (
              <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: "8px", background: "#2a5878", borderTop: "1px solid #5a8ab0" }}>
                <span style={{ display: "flex", gap: "3px", color: "#a8d8f8" }}>
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "#78aac8", letterSpacing: "0.1em" }}>
                  ARBITER DELIBERATING…
                </span>
              </div>
            )}

            {/* Verdict */}
            {verdict && <VerdictCard verdict={verdict} debaters={debaters} />}
          </div>
        )}

        {/* ── Idle / error empty state ────────────────────────────────────── */}
        {!isActive && (
          <div style={{ padding: "48px 24px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.1em" }}>
            {status === "error"
              ? <span style={{ color: "#c83030" }}>⚠ {errorMsg || "An error occurred. Please try again."}</span>
              : <span style={{ color: "#8aacca" }}>ENTER A MOTION ABOVE TO BEGIN THE DEBATE</span>
            }
          </div>
        )}

        {/* ── Status bar ─────────────────────────────────────────────────── */}
        <footer style={{ height: "30px", display: "flex", alignItems: "center", gap: "10px", padding: "0 24px", background: "#e4edf5", borderTop: "0.5px solid #c8d4e0" }}>
          <div
            className={isLive ? "dot-live" : ""}
            style={{ width: "6px", height: "6px", borderRadius: "50%", background: isLive ? "#d05a18" : "#3a8fc8", flexShrink: 0 }}
          />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.09em", color: "#2e5a78" }}>
            {statusText}
          </div>
          <div style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
            {[0, 1, 2, 3, 4, 5].map(i => {
              const turn = turns[i];
              return (
                <div key={i} style={{ width: "18px", height: "3px", borderRadius: "1px", background: turn ? (turn.side === "for" ? "#c87830" : "#3a8fc8") : "#c8d4e0" }} />
              );
            })}
          </div>
        </footer>

      </div>
    </div>
  );
}

// ── StreamingPill ─────────────────────────────────────────────────────────────
function StreamingPill({ name, label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0 2px" }}>
      <span style={{ display: "flex", gap: "3px", color }}>
        <span className="thinking-dot" />
        <span className="thinking-dot" />
        <span className="thinking-dot" />
      </span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color, letterSpacing: "0.1em" }}>
        {name.toUpperCase()} IS {label.toUpperCase()}…
      </span>
    </div>
  );
}
