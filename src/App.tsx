import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import { supabase } from './supabaseClient.ts'
import OAuthConsent from './OAuthConsent';
import Login from './Login';
import './App.css';

/*
Where to Place Console Logs
- Inside a Component Body: 
  Placing a log directly in the function body will trigger every time the component renders.

  - Inside Event Handlers: Use logs within functions like onClick or onChange to capture 
    user interactions and the resulting data.

  - Inside useEffect: This is the most accurate way to log state changes in functional 
    components, as it runs after the DOM has been updated.

` - Inside JSX (Expressions): To log within a return statement, wrap the log in an 
    expression: {console.log("Rendering...")}. Note that this will return undefined to the DOM. 

*/

const MainApp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const authorizationId = searchParams.get('authorization_id')
  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    async function loadAuthDetails() {
      if (authorizationId) {
        console.log("Authorization ID found in query params:", authorizationId);
        // Handle auto-approved authorization_id?
      }
    }
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);
      if (user) {
        console.log("User is authenticated, navigating to:", redirectTo);
        navigate(redirectTo);
      }
    };
    loadAuthDetails()
    checkUser();
  }, [navigate, authorizationId, redirectTo]);

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
  console.log("Current location:", location.pathname);
  
  // Check if current route should be handled by components (OAuthConsent and Login)
  const isPublicRoute = location.pathname.startsWith('/oauth/consent') || location.pathname.startsWith('/login');
  console.log("Is public route:", isPublicRoute);

  if (isPublicRoute) {
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
