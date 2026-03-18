import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import MovieCard from "./MovieCard";
import { supabase } from "../supabaseClient";

const LandingPage = ({ setActiveTab }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      let { data, error } = await supabase.from("movies").select("*");

      if (error) {
        console.error("Error fetching movies:", error);
      }

      if (data) {
        setMovies(data);
      }
    };

    fetchMovies();
  }, []);

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center justify-center px-[5%] py-16 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(30,30,40,0.8)_0%,var(--color-bg-dark)_80%)] -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(245,197,24,0.05)_0%,transparent_70%)] rounded-full -z-10"></div>

        <div>
          <h1 className="text-[clamp(3rem,8vw,5rem)] mb-4 bg-gradient-to-r from-white to-[#aaa] bg-clip-text text-transparent animate-[fadeUp_0.8s_ease-out_forwards]">
            CineGuessr
          </h1>
          <p className=" text-text-secondary max-w-[600px] mx-auto mb-10 ">
            Muestra tus conocimientos cinematográficos en este juego
          </p>
          <button
            className="inline-flex items-center gap-3 bg-primary text-bg-darker px-8 py-4 rounded-full text-lg font-bold transition-all duration-200 cursor-pointer "
            onClick={() => setActiveTab("game")}
          >
            <Play size={20} fill="currentColor" /> JUEGA AHORA
          </button>
        </div>
      </section>

      <section className="px-[5%] py-16">
        <h2 className="text-[2.5rem] mb-12 text-center">
          Peliculas disponibles en el juego
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </>
  );
};

export default LandingPage;
