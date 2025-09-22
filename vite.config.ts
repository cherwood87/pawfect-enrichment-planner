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
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge'],
          // Split large feature chunks
          'dashboard-chunk': [
            './src/components/dashboard/DashboardContent',
            './src/components/dashboard/SimplifiedDashboardContent',
            './src/components/dashboard/TodaysEnrichmentSummary'
          ],
          'activity-chunk': [
            './src/components/ActivityLibrary',
            './src/components/ActivityCard',
            './src/services/activityService'
          ],
          'weekly-planner-chunk': [
            './src/components/weekly-planner/WeeklyPlannerView',
            './src/components/weekly-planner/WeeklyGrid'
          ]
        }
      }
    },
    // Enable tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : []
      }
    }
  }
}));
