import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "./MovieCard";
import { Target, Trophy, RotateCcw } from "lucide-react";
import { supabase } from "../supabaseClient";

const GamePage = () => {
  const [currentMovies, setCurrentMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [gameState, setGameState] = useState("playing");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      let { data, error } = await supabase.from("movies").select("*");

      if (error) {
        console.error("Error fetching movies:", error);
      }

      if (data) {
        setMovies(data);
        console.log("Movies fetched for game");
      }
    };

    fetchMovies();
  }, []);

  const getRandomMovies = (count = 2) => {
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const startNewRound = useCallback(() => {
    setCurrentMovies(getRandomMovies(2));
    setSelectedMovieId(null);
    setGameState("playing");
  }, [movies]);

  useEffect(() => {
    if (movies.length > 0) {
      startNewRound();
    }
  }, [movies]);

  const handleMovieSelect = (movie) => {
    if (gameState !== "playing") return;

    setSelectedMovieId(movie.id);
    setGameState("checking");

    const [movie1, movie2] = currentMovies;
    const date1 = new Date(movie1.release_date);
    const date2 = new Date(movie2.release_date);

    let isCorrect = false;

    if (date1 < date2) {
      if (movie.id === movie1.id) isCorrect = true;
    } else if (date2 < date1) {
      if (movie.id === movie2.id) isCorrect = true;
    } else {
      isCorrect = true; // Tie
    }

    if (isCorrect) {
      setScore((s) => {
        const newScore = s + 1;
        if (newScore > highScore) setHighScore(newScore);
        return newScore;
      });
      setTimeout(() => startNewRound(), 2500);
      setGameState("correct");
    } else {
      setScore(0);
      setGameState("wrong");
    }
  };

  if (currentMovies.length < 2) return null;

  const getContenderClass = (movie) => {
    if (gameState === "playing") return "";

    const [m1, m2] = currentMovies;
    const isM1Older = new Date(m1.release_date) < new Date(m2.release_date);
    const olderMovieId = isM1Older ? m1.id : m2.id;

    if (movie.id === selectedMovieId) {
      return gameState === "correct"
        ? "scale-105 shadow-[0_0_30px_rgba(76,175,80,0.5)] border-2 border-success z-10"
        : "scale-95 opacity-50 border-2 border-error";
    } else {
      return movie.id === olderMovieId
        ? "scale-105 shadow-[0_0_30px_rgba(76,175,80,0.5)] border-2 border-success z-10"
        : "opacity-30 scale-95";
    }
  };

  return (
    <div className="flex-1 flex flex-col px-[5%] py-8 items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="text-center mb-12 animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-5xl mb-2 font-display font-bold">
          Cual salió antes?
        </h1>
        <p className="text-text-secondary text-xl">
          Elige la pelicula que salió primero
        </p>

        <div className="flex gap-8 mt-6 justify-center">
          <div className="bg-bg-card px-6 py-2 rounded-full font-semibold border border-border-theme text-white">
            <Target size={16} className="inline mr-2 align-middle" />
            Puntaje: {score}
          </div>
          <div className="bg-bg-card px-6 py-2 rounded-full font-semibold border border-border-theme text-primary">
            <Trophy size={16} className="inline mr-2 align-middle" />
            Record {highScore}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1000px] relative mb-12">
        {currentMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`flex-1 bg-amber-300 rounded-[24px] overflow-hidden cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] relative hover:scale-[1.03] hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] hover:z-10 ${getContenderClass(movie)}`}
            onClick={() => handleMovieSelect(movie)}
          >
            <MovieCard movie={movie} isGame={true} hideYear={true} />
            <div className="absolute bottom-0 left-0 w-full pt-8 pb-6 px-6 bg-gradient-to-t from-black/90 to-transparent z-10">
              <h2 className="text-2xl mb-1">{movie.title}</h2>
              {gameState !== "playing" && (
                <div className="text-primary text-xl font-semibold mt-2">
                  {movie.release_date.split("-")[0]}
                </div>
              )}
            </div>
            {gameState !== "playing" &&
              movie.id === selectedMovieId &&
              gameState === "correct" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-8 py-4 rounded-full text-3xl font-extrabold text-primary z-20 whitespace-nowrap animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                  +1 Punto
                </div>
              )}
          </div>
        ))}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] bg-bg-dark border-2 border-border-theme rounded-full flex items-center justify-center font-display font-extrabold text-2xl text-primary z-20 shadow-custom-lg">
          VS
        </div>
      </div>

      <div className="h-[80px] flex items-center justify-center w-full">
        {gameState === "correct" && (
          <div className="text-3xl font-extrabold font-display bg-clip-text text-success animate-[fadeIn_0.3s_ease-out]">
            Correct!
          </div>
        )}
        {gameState === "wrong" && (
          <>
            <div className="text-3xl font-extrabold font-display bg-clip-text text-error animate-[fadeIn_0.3s_ease-out]">
              Game Over!
            </div>
            <button
              className="bg-white text-black px-12 py-4 rounded-full text-xl font-bold ml-8 transition-transform duration-200 animate-[popIn_0.3s_ease-out] hover:scale-105 hover:bg-primary"
              onClick={startNewRound}
            >
              <RotateCcw size={20} className="inline mr-2 align-middle" />
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GamePage;
