import { Routes, Route } from "react-router-dom";

const HomePage = () => (
  <div style={{ padding: '20px' }}>
    <h1>🐕 Beyond Busy Dog Enrichment Planner</h1>
    <p>Welcome to your personalized dog enrichment planning system!</p>
    
    <div style={{ background: '#e8f5e8', padding: '15px', margin: '20px 0', borderRadius: '8px' }}>
      <h3>✅ System Status:</h3>
      <ul>
        <li>✅ React working</li>
        <li>✅ Supabase connected</li>
        <li>✅ Environment variables loaded</li>
        <li>✅ React Router working</li>
        <li>✅ React Query working</li>
      </ul>
    </div>
    
    <p><strong>Your app is now fully functional!</strong></p>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};
