/**
 * How Would They Say It? — The Workplace Gazette
 * Newspaper masthead + voice nav pills + editorial section split + office memo cards.
 */
import { useState, useRef } from "react";
import PhraseInput   from "./components/PhraseInput.jsx";
import PersonaCard   from "./components/PersonaCard.jsx";
import PersonaModal  from "./components/PersonaModal.jsx";
import LoadingGrid   from "./components/LoadingGrid.jsx";
import { useTranslation }  from "./hooks/useTranslation.js";
import { usePersonaModal } from "./hooks/usePersonaModal.js";

// Front-page personas: executive suite (2×2 grid)
const FRONT_PAGE_IDS = new Set([
  "diplomatic-ceo",
  "ragequit-ceo",
  "hr-karen",
  "enthusiastic-intern",
]);

// Voice nav: matches page order — front page first, dispatches second
const VOICE_NAV = [
  { id: "diplomatic-ceo",          label: "Christopher", title: "CEO",          dot: "#4338CA" },
  { id: "ragequit-ceo",            label: "Marcus",      title: "COO",          dot: "#DC2626" },
  { id: "hr-karen",                label: "Deborah",     title: "HR Partner",   dot: "#2563EB" },
  { id: "enthusiastic-intern",     label: "Tyler",       title: "CoS Intern",   dot: "#16A34A" },
  { id: "burned-out-admin",        label: "Janet",       title: "Exec. Asst.",  dot: "#6B7280" },
  { id: "the-lawyer",              label: "Richard",     title: "Gen. Counsel", dot: "#059669" },
  { id: "passive-aggressive-boss", label: "Sandra",      title: "Sr. Manager",  dot: "#7C3AED" },
  { id: "wellness-girlboss",       label: "Amber",       title: "Wellness",     dot: "#DB2777" },
];

function SectionRule({ left, right }) {
  return (
    <div style={{
      background: "#C8BFA8",
      borderTop: "1px solid #A89880", borderBottom: "1px solid #A89880",
      padding: "5px 10px", marginBottom: "12px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span style={{
        fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase",
        color: "#2C2416", fontFamily: "Georgia, serif", fontWeight: "600",
      }}>
        {left}
      </span>
      {right && (
        <span style={{
          fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase",
          color: "#2C2416", fontFamily: "Georgia, serif", fontWeight: "600",
        }}>
          {right}
        </span>
      )}
    </div>
  );
}

export default function App() {
  const { status, data, error, translate, reset } = useTranslation();
  const { modal, openPersona, closePersona } = usePersonaModal();
  const [highlighted, setHighlighted] = useState(null);
  const hlTimerRef = useRef(null);

  // Click a voice pill → scroll to its card and briefly highlight it
  const jumpTo = (id) => {
    if (hlTimerRef.current) clearTimeout(hlTimerRef.current);
    setHighlighted(id);
    const el = document.getElementById(`card-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    hlTimerRef.current = setTimeout(() => setHighlighted(null), 2500);
  };

  // Split results into the two editorial sections
  const frontPage  = data?.results.filter(p =>  FRONT_PAGE_IDS.has(p.id)) ?? [];
  const dispatches = data?.results.filter(p => !FRONT_PAGE_IDS.has(p.id)) ?? [];

  const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const year  = new Date().getFullYear();

  return (
    <div style={{ background: "#EDE8DC", minHeight: "100vh" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "20px 16px" }}>

        {/* ── Masthead ──────────────────────────────────────────────── */}
        <header style={{ marginBottom: "4px" }}>
          <div style={{ borderTop: "3px double #2C2416", borderBottom: "1px solid #2C2416", padding: "8px 0 6px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "#7A6A52", textAlign: "center", minWidth: "72px", lineHeight: 1.5 }}>
                Vol. XLII<br />No. 7
              </div>
              <div style={{ textAlign: "center", flex: 1 }}>
                <h1 style={{ fontFamily: "Georgia, serif", margin: 0, color: "#1C1510", fontSize: "clamp(25px, 5vw, 41px)", fontWeight: 500, letterSpacing: "-0.5px" }}>
                  The Workplace Gazette
                </h1>
                <p style={{ margin: "3px 0 0", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#7A6A52" }}>
                  8 workplace personalities &bull; 1 phrase &bull; maximum chaos
                </p>
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "#7A6A52", textAlign: "center", minWidth: "72px", lineHeight: 1.5 }}>
                {today}<br />{year}
              </div>
            </div>
          </div>
          <div style={{ borderBottom: "0.5px solid #C4B99A", marginBottom: "16px" }} />
        </header>

        {/* ── Phrase input ──────────────────────────────────────────── */}
        {(status === "idle" || status === "error") && (
          <section style={{ maxWidth: "620px", margin: "0 auto", paddingBottom: "3rem" }}>
            <PhraseInput onSubmit={translate} isLoading={false} />
            {error && (
              <div style={{ marginTop: "12px", border: "0.5px solid #C4A882", background: "#F9EDD8", borderRadius: "8px", padding: "12px 16px", fontSize: "15px", color: "#7A4A1E", fontFamily: "system-ui, sans-serif" }}>
                {error}
              </div>
            )}
          </section>
        )}

        {/* ── Loading skeletons ─────────────────────────────────────── */}
        {status === "loading" && <LoadingGrid />}

        {/* ── Results ───────────────────────────────────────────────── */}
        {status === "success" && data && (
          <div className="animate-fade-in">

            {/* ── Routing headline ───────────────────────────────── */}
            <div style={{ textAlign: "center", marginBottom: "18px", borderBottom: "1px solid #C4B99A", paddingBottom: "14px" }}>
              <p style={{ margin: "0 0 5px", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#7A6A52", fontFamily: "system-ui, sans-serif", fontWeight: "500" }}>
                Memo Routing &mdash; 8 Memos Issued
              </p>
              <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: "clamp(17px, 3.5vw, 24px)", fontWeight: "bold", color: "#1C1510", fontStyle: "italic", lineHeight: 1.3 }}>
                &ldquo;{data.phrase}&rdquo;
              </h2>
            </div>

            {/* ── Voice nav pills ────────────────────────────────── */}
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px", marginBottom: "14px", scrollbarWidth: "none" }}>
              {VOICE_NAV.map((v) => (
                <button
                  key={v.id}
                  onClick={() => jumpTo(v.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    padding: "5px 12px", borderRadius: "20px",
                    flexShrink: 0, cursor: "pointer",
                    border: highlighted === v.id ? "1px solid #2C2416" : "1px solid #C4B99A",
                    background: highlighted === v.id ? "#2C2416" : "#FDF8F0",
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: v.dot, flexShrink: 0, display: "inline-block" }} />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", fontFamily: "system-ui, sans-serif", color: highlighted === v.id ? "#F5F0E8" : "#3A2E1E", lineHeight: "1.25" }}>
                      {v.label}
                    </span>
                    <span style={{ fontSize: "10px", fontWeight: "400", fontFamily: "system-ui, sans-serif", color: highlighted === v.id ? "#C4B99A" : "#7A6A52", lineHeight: "1.2" }}>
                      {v.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* ── Front page ─────────────────────────────────────── */}
            <SectionRule left="Front page — leadership memos" right="All Departments" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "10px" }}>
              {frontPage.map((persona, i) => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  index={i}
                  onOpenInfo={openPersona}
                  isHighlighted={highlighted === persona.id}
                />
              ))}
            </div>

            {/* ── Staff dispatches ───────────────────────────────── */}
            <SectionRule left="Staff dispatches — field memos" right="Internal Only" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "2rem" }}>
              {dispatches.map((persona, i) => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  index={i + frontPage.length}
                  onOpenInfo={openPersona}
                  isHighlighted={highlighted === persona.id}
                  fullWidth={persona.id === "wellness-girlboss"}
                />
              ))}
            </div>

            {/* Reset */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <button
                onClick={reset}
                style={{ padding: "10px 28px", borderRadius: "8px", fontWeight: "500", fontSize: "15px", background: "#2C2416", color: "#F5F0E8", border: "none", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}
              >
                Distribute another phrase &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer style={{ textAlign: "center", color: "#A8957A", fontSize: "12px", paddingBottom: "1.5rem", fontFamily: "Georgia, serif" }}>
          The Workplace Gazette &bull; 8 AI Persona Agents &bull; All opinions are in-character
        </footer>
      </div>

      {/* ── Persona modal ─────────────────────────────────────────────── */}
      <PersonaModal modal={modal} onClose={closePersona} />
    </div>
  );
}
