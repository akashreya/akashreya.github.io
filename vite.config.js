import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",
  server: {
    host: true,
    port: 5173,
    // Playwright writes these mid-run; watching them reloads the page under test and,
    // on Windows, a locked report file throws an unhandled EBUSY that kills the server.
    watch: {
      ignored: ["**/playwright-report/**", "**/test-results/**", "**/*-snapshots/**"],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
