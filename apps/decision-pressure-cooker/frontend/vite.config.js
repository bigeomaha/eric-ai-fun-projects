import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/decision-pressure-cooker/",
  plugins: [react()],
  server: {
    port: 5173,
  },
});
