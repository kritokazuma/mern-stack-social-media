import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://arcane-taiga-95230.herokuapp.com",
        rewrite: (path) => path.replace("/^/api/", ""),
        changeOrigin: true,
        secure: false,
      },
      "/ws": {
        target: "ws://localhost:4000",
        changeOrigin: false,
      },
    },
  },
});
