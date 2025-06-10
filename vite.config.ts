
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
    // Optimize chunk splitting for better caching and loading
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - group by library
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'form-vendor';
            }
            if (id.includes('react-window') || id.includes('react-virtualized')) {
              return 'virtualization-vendor';
            }
            if (id.includes('date-fns') || id.includes('lucide-react')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }

          // Feature-based chunks
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1].split('.')[0];
            return `page-${pageName.toLowerCase()}`;
          }

          if (id.includes('/dashboard/')) {
            return 'dashboard-feature';
          }

          if (id.includes('/weekly-planner/')) {
            return 'weekly-planner-feature';
          }

          if (id.includes('/activity-library') || id.includes('ActivityLibrary')) {
            return 'activity-library-feature';
          }

          if (id.includes('/chat/')) {
            return 'chat-feature';
          }

          // Context and service chunks
          if (id.includes('/contexts/')) {
            return 'contexts';
          }

          if (id.includes('/services/')) {
            return 'services';
          }

          if (id.includes('/hooks/')) {
            return 'hooks';
          }

          // UI components
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
        }
      }
    },
    
    // Optimize for performance
    assetsInlineLimit: 2048, // Inline smaller assets
    sourcemap: mode === 'development',
    cssCodeSplit: true,
    target: 'es2020',
    
    // Advanced optimization settings
    minify: mode === 'production' ? 'esbuild' : false,
    reportCompressedSize: false, // Faster builds
    chunkSizeWarningLimit: 1000, // Warn for chunks > 1MB
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'date-fns',
      'lucide-react',
      'react-window'
    ],
    exclude: [
      // Large libraries loaded on demand
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs'
    ]
  },
  
  // Enhanced esbuild settings
  esbuild: {
    treeShaking: true,
    minifyIdentifiers: mode === 'production',
    minifySyntax: mode === 'production',
    minifyWhitespace: mode === 'production',
    // Remove console logs in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  }
}));
