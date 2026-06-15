import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/how-would-they-say-it/",
  plugins: [react()],
  server: {
    port: 5174,
  },
});
