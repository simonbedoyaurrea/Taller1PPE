import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import GamePage from "./components/GamePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { supabase } from "./supabaseClient";
import SerieMaker from "./components/SerieMaker";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("login");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
        setCurrentPage("home");
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setCurrentPage("home");
        } else {
          setUser(null);
          setCurrentPage("login");
        }
      },
    );

    return () => authListener?.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  // Si no está logueado y intenta acceder al juego, mostrar login
  if (!user && activeTab === "game") {
    return (
      <>
        {currentPage === "login" && (
          <LoginPage
            setCurrentPage={setCurrentPage}
            setUser={setUser}
            onLoginSuccess={() => setActiveTab("game")}
          />
        )}
        {currentPage === "register" && (
          <RegisterPage
            setCurrentPage={setCurrentPage}
            setUser={setUser}
            onLoginSuccess={() => setActiveTab("game")}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        setUser={setUser}
      />

      <main className="flex-1 flex flex-col">
        {activeTab === "home" && <LandingPage setActiveTab={setActiveTab} />}
        {activeTab === "game" && user && <GamePage />}
        {activeTab === "series" && <SerieMaker />}
      </main>
    </div>
  );
}

export default App;
