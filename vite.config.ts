import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  base: "https://invest.raniminvesting.com/", // or just '/' if it's the root of subdomain
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
