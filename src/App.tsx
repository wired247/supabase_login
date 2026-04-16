import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import { supabase } from './supabaseClient.ts'
import OAuthConsent from './OAuthConsent';
import Login from './Login';
import './App.css';

const MainApp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate(redirectTo);
      }
    };
    checkUser();
  }, [navigate, redirectTo]);

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
  
  // Check if current route should be handled by components (OAuthConsent or Login)
  const isCustomRoute = location.pathname.startsWith('/oauth/consent') 
    || location.pathname.startsWith('/login');

  if (isCustomRoute) {
    return (
      <Routes>
        <Route path="/oauth/consent" element={<OAuthConsent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    );
  }
  
  // All other routes
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
