/**
 * useDecisionAnalysis hook
 * Handles the API call, loading state, and error management.
 */

import { useState, useCallback } from "react";

export function useDecisionAnalysis() {
  const [state, setState] = useState({
    status: "idle", // idle | loading | success | error
    data: null,
    error: null,
  });

  const analyze = useCallback(async (decision, voiceIds) => {
    setState({ status: "loading", data: null, error: null });

    try {
      const body = { decision };
      if (voiceIds && voiceIds.length > 0) body.voices = voiceIds;

      const response = await fetch("/decision-pressure-cooker/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Analysis failed.");
      }

      setState({ status: "success", data: json, error: null });
    } catch (err) {
      setState({ status: "error", data: null, error: err.message });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle", data: null, error: null });
  }, []);

  return { ...state, analyze, reset };
}
