import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Syllabus from "./pages/Syllabus";
import StudyPlanner from "./pages/StudyPlanner";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

import AIChatAssistant from "./components/dashboard/AIChatAssistant";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-[#0A0A0A] text-white">
        {user && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {user && <Navbar user={user} />}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0A0A0A]">
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
              <Route
                path="/dashboard"
                element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
              />
              <Route
                path="/syllabus"
                element={user ? <Syllabus user={user} /> : <Navigate to="/" />}
              />
              <Route
                path="/analysis"
                element={user ? <Analysis user={user} /> : <Navigate to="/" />}
              />
              <Route
                path="/study-planner"
                element={user ? <StudyPlanner user={user} /> : <Navigate to="/" />}
              />
            </Routes>
          </main>
        </div>
        {user && <AIChatAssistant />}
      </div>
    </Router>
  );
}
