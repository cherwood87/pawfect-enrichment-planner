
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
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-accordion'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Feature chunks
          'dashboard': [
            './src/components/dashboard/DashboardContent.tsx',
            './src/components/dashboard/DashboardHeader.tsx'
          ],
          'weekly-planner': [
            './src/components/weekly-planner/WeeklyPlannerV2.tsx',
            './src/hooks/useWeeklyPlannerLogic.ts'
          ],
          'activity-library': [
            './src/components/ActivityLibrary.tsx',
            './src/components/ActivityModal.tsx'
          ],
          'contexts': [
            './src/contexts/ActivityStateContextV2.tsx',
            './src/contexts/ActivityOperationsContextV2.tsx'
          ]
        }
      }
    },
    
    // Compress and optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    
    // Enable source maps for debugging in production
    sourcemap: mode === 'development',
    
    // Optimize CSS
    cssCodeSplit: true,
    
    // Target modern browsers for smaller bundles
    target: 'es2020'
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
    ],
    exclude: [
      // Exclude large libraries that should be loaded on demand
    ]
  },
  
  // Enable experimental features for better performance
  esbuild: {
    // Enable tree shaking for unused exports
    treeShaking: true,
    // Optimize for smaller bundle size
    minifyIdentifiers: mode === 'production',
    minifySyntax: mode === 'production',
    minifyWhitespace: mode === 'production'
  }
}));
