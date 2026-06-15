/**
 * PersonaModal — paper-themed overlay rendering the persona's .md backstory.
 * Closes on backdrop click or Escape key.
 */
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function PersonaModal({ modal, onClose }) {
  useEffect(() => {
    if (!modal.open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal.open, onClose]);

  if (!modal.open) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="animate-fade-in"
        style={{ position: "absolute", inset: 0, background: "rgba(28,21,16,0.55)" }}
      />

      {/* Panel */}
      <div
        className="animate-slide-up"
        style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: "520px", maxHeight: "80vh",
          overflowY: "auto", borderRadius: "12px",
          border: "0.5px solid #C4B99A", background: "#FDF8F0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "12px", right: "12px",
            width: "28px", height: "28px",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", border: "0.5px solid #C4B99A",
            background: "transparent", cursor: "pointer", color: "#7A6A52", zIndex: 10,
          }}
        >
          <CloseIcon />
        </button>

        <div style={{ padding: "20px 24px" }}>
          {modal.loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 0" }}>
              <svg
                className="animate-spin"
                style={{ width: "22px", height: "22px", color: "#A8957A" }}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              >
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <div className="persona-prose">
              <ReactMarkdown>{modal.markdown}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
