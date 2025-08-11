import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { observeLongTasks, logNavigationTimings, logResourceSummary } from '@/utils/perf'

// Initialize performance observers early
observeLongTasks()
logNavigationTimings()

// Defer resource summary slightly to allow initial requests to land
setTimeout(() => {
  logResourceSummary('supabase.co')
}, 3000)

createRoot(document.getElementById("root")!).render(<App />);
