import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "@samrum/vite-plugin-web-extension";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: manifest as any,
      useDynamicUrlWebAccessibleResources: false,
      additionalInputs: {
        html: ["src/popup/index.html"],
      },
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: ["chromium-bidi/lib/cjs/bidiMapper/BidiMapper.js"],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@supabase/supabase-js": "@supabase/supabase-js",
      "@supabase/functions-js": "@supabase/functions-js",
      "@supabase/postgrest-js": "@supabase/postgrest-js",
      "@supabase/node-fetch": "@supabase/node-fetch",
      "@supabase/realtime-js": "@supabase/realtime-js",
      "@supabase/storage-js": "@supabase/storage-js",
      "@supabase/auth-js": "@supabase/auth-js",
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
