/**
 * Fetches a persona's markdown file and manages modal open/close state.
 */
import { useState, useCallback } from "react";

export function usePersonaModal() {
  const [modal, setModal] = useState({ open: false, id: null, markdown: "", loading: false });

  const openPersona = useCallback(async (id) => {
    setModal({ open: true, id, markdown: "", loading: true });
    try {
      const res = await fetch(`/how-would-they-say-it/api/translate/personas/${id}`);
      if (!res.ok) throw new Error("Could not load persona.");
      const text = await res.text();
      setModal({ open: true, id, markdown: text, loading: false });
    } catch (err) {
      setModal({ open: true, id, markdown: `**Error:** ${err.message}`, loading: false });
    }
  }, []);

  const closePersona = useCallback(() => {
    setModal({ open: false, id: null, markdown: "", loading: false });
  }, []);

  return { modal, openPersona, closePersona };
}
