import { useState, useCallback } from "react";

export function useTranslation() {
  const [state, setState] = useState({ status: "idle", data: null, error: null });

  const translate = useCallback(async (phrase) => {
    setState({ status: "loading", data: null, error: null });
    try {
      const res = await fetch("/how-would-they-say-it/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Translation failed.");
      setState({ status: "success", data: json, error: null });
    } catch (err) {
      setState({ status: "error", data: null, error: err.message });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle", data: null, error: null }), []);

  return { ...state, translate, reset };
}
