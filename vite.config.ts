import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      timeout: 5000, // Reduced HMR timeout
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimized chunk splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - more granular splitting
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("@radix-ui")) {
              return "ui-vendor";
            }
            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }
            if (id.includes("@supabase")) {
              return "supabase-vendor";
            }
            return "vendor";
          }

          // Feature-based chunks - only for large features
          if (id.includes("/pages/")) {
            return "pages";
          }

          if (id.includes("/components/ui/")) {
            return "ui-components";
          }

          if (id.includes("/contexts/")) {
            return "contexts";
          }
        },
      },
    },

    // Optimize for performance and reliability
    assetsInlineLimit: 2048, // Reduced from 4096 for smaller bundles
    sourcemap: mode === "development",
    cssCodeSplit: true, // Re-enabled for better loading performance
    target: "es2020",

    minify: mode === "production" ? "esbuild" : false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500, // Reduced from 2000 for better performance
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "@supabase/supabase-js",
      "date-fns",
      "lucide-react",
    ],
    exclude: ["@vite/client", "@vite/env"],
  },

  esbuild: {
    treeShaking: true,
    minifyIdentifiers: mode === "production",
    minifySyntax: mode === "production",
    minifyWhitespace: mode === "production",
    drop: mode === "production" ? ["console", "debugger"] : [],
    logOverride: {
      "this-is-undefined-in-esm": "silent",
    },
  },
}));
