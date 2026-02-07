import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Background } from "./components/Background";
import { PageTransition } from "./components/PageTransition";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Landing } from "./pages/Landing";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { PublicProfile } from "./pages/PublicProfile";
import AuthCallback from "./pages/AuthCallback";

const AnimatedRoutes = ({ onAuth }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Landing />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <Signup onAuth={onAuth} />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login onAuth={onAuth} />
            </PageTransition>
          }
        />
        <Route
          path="/auth-callback"
          element={
            <AuthCallback />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/u/:username"
          element={
            <PageTransition>
              <PublicProfile />
            </PageTransition>
          }
        />
        <Route
          path="/demo"
          element={
            <PageTransition>
              <Dashboard isDemo={true} />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("cc_token");
    if (!token) {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cc_token");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Background>
        <Navbar isAuthed={!!user || !!localStorage.getItem("cc_token")} onLogout={handleLogout} />
        <AnimatedRoutes onAuth={setUser} />
        <Footer />
      </Background>
    </BrowserRouter>
  );
};

export default App;
