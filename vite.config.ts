import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { port } from "./config.json";

// https://vitejs.dev/config/
export default defineConfig({
  server: { port },
  plugins: [react()],
});
