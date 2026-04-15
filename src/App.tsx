import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import OAuthConsent from './OAuthConsent';
import Login from './Login';
import './App.css';

const MainApp: React.FC = () => {

  useEffect(() => {
    // nothing to load here
  }, []);

  return (
    <main>
      <h1>Amplify app</h1>
      <div>
        🥳 App successfully hosted.
      </div>
    </main>
  );
}

// Protected route wrapper component that requires authentication
const DefaultRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

// Component that determines if route should be protected or public
const RouteManager: React.FC = () => {
  const location = useLocation();
  
  // Check if current route should be public (no authentication required)
  const isPublicRoute = location.pathname.startsWith('/oauth/consent') || location.pathname.startsWith('/login');
  
  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/oauth/consent" element={<OAuthConsent />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }
  
  // All other routes require authentication
  return (
    <DefaultRoute>
      <Routes>
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </DefaultRoute>
  );
};

// Main App component with routing
const App: React.FC = () => {
  return (
    <Router>
      <RouteManager />
    </Router>
  );
};

export default App;
