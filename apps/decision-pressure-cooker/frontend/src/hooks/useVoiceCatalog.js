/**
 * useVoiceCatalog hook
 * Fetches the voice catalog from the API on mount.
 */

import { useState, useEffect } from "react";

export function useVoiceCatalog() {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchVoices() {
      try {
        const res = await fetch("/decision-pressure-cooker/api/voices");
        if (!res.ok) throw new Error("Failed to load voices");
        const data = await res.json();
        if (!cancelled) {
          setVoices(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchVoices();
    return () => { cancelled = true; };
  }, []);

  return { voices, loading, error };
}
