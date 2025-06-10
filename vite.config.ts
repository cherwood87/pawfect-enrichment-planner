
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
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Simplified chunk splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - simplified grouping
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            return 'vendor';
          }

          // Feature-based chunks - only for large features
          if (id.includes('/pages/')) {
            return 'pages';
          }

          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
        }
      }
    },
    
    // Optimize for performance and reliability
    assetsInlineLimit: 4096,
    sourcemap: mode === 'development',
    cssCodeSplit: false, // Keep CSS together for faster loading
    target: 'es2020',
    
    minify: mode === 'production' ? 'esbuild' : false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 2000, // More lenient chunk size
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'date-fns',
      'lucide-react'
    ]
  },
  
  esbuild: {
    treeShaking: true,
    minifyIdentifiers: mode === 'production',
    minifySyntax: mode === 'production',
    minifyWhitespace: mode === 'production',
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  }
}));
