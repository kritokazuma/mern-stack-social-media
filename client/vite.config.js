import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://shrouded-atoll-71846.herokuapp.com/",
        rewrite: (path) => path.replace("/^/api/", ""),
      },
      "/ws": {
        target: "https://shrouded-atoll-71846.herokuapp.com/",
        changeOrigin: false,
      },
    },
  },
});
