import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

const target = process.env.TARGET || "chrome";

export default defineConfig({
  define: {
    __BROWSER__: JSON.stringify(target),
  },
  plugins: [
    webExtension({
      browser: target,
      manifest: () => {
        // Use `readJsonFile` instead of import/require to avoid caching during rebuild.
        const pkg = readJsonFile("package.json");
        const template = readJsonFile("manifest.json");
        return {
          ...template,
          version: pkg.version,
        };
      },
      webExtConfig: {
        target: target === "firefox" ? "firefox-desktop" : "chromium",
        startUrl: process.env.START_URL?.split(","),
      },
    }),
    react(),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: ["chromium-bidi/lib/cjs/bidiMapper/BidiMapper.js"],
      output: {
        inlineDynamicImports: false,
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
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
