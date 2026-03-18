import React, { useState, useEffect } from "react";
import { Film, Play, LogOut, Pen } from "lucide-react";
import { supabase } from "../supabaseClient";

const Navbar = ({ activeTab, setActiveTab, user, setUser }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav
      className={`sticky top-0 z-50 flex justify-between items-center px-[5%] py-4 border-b border-border-theme transition-colors duration-300 ${scrolled ? "bg-[#050506]/85 backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="flex items-center gap-3 font-display text-2xl font-extrabold text-text-primary uppercase tracking-widest">
        <Film className="text-primary" size={28} />
        <span>
          Cine<span className="text-text-primary">Guessr</span>
        </span>
      </div>

      <div className="flex gap-8 items-center">
        <button
          className={`relative py-2 text-base font-semibold transition-colors duration-200 ${activeTab === "home" ? "text-primary" : "text-text-secondary hover:text-primary"}`}
          onClick={() => setActiveTab("home")}
        >
          Home
          {activeTab === "home" && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-glow-primary"></span>
          )}
        </button>
        <button
          className={`relative py-2 flex items-center gap-2 text-base font-semibold transition-colors duration-200 ${activeTab === "game" ? "text-primary" : "text-text-secondary hover:text-primary"}`}
          onClick={() => setActiveTab("game")}
        >
          <Play size={16} /> Play Game
          {activeTab === "game" && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-glow-primary"></span>
          )}
        </button>
        <button
          className={`relative py-2 flex items-center gap-2 text-base font-semibold transition-colors duration-200 ${activeTab === "series" ? "text-primary" : "text-text-secondary hover:text-primary"}`}
          onClick={() => setActiveTab("series")}
        >
          <Pen size={16} /> Serie Maker
          {activeTab === "series" && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-glow-primary"></span>
          )}
        </button>

        {user && (
          <div className="flex items-center gap-4 ml-8 pl-8 border-l border-border-theme">
            <span className="text-text-secondary text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
