import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { useAuth } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
// import AskGpt from './pages/AskGpt';
// import Roadmap from "./pages/Roadmap";
import Sketchpad from './pages/Sketchpad';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <ThemeProvider>
      <AppProvider>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="categories" element={<Categories />} />
            {/* <Route path="ask-gpt" element={<AskGpt />} /> */}
            {/* <Route path="roadmap" element={<Roadmap />} /> */}
            <Route path="sketchpad" element={<Sketchpad />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AppProvider>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              className: "dark:bg-gray-800 dark:text-white",
            }}
          />
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
