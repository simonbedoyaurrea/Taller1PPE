import React, { useState } from "react";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='100%25' height='100%25' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' fill='%23fff' font-size='20' text-anchor='middle' alignment-baseline='middle'%3ENo%20Image%3C/text%3E%3C/svg%3E";

const truncate = (text, n = 150) => {
  if (!text) return "";
  return text.length > n ? text.slice(0, n).trim() + "..." : text;
};

const MovieCard = ({ movie, isGame = false, hideYear = false }) => {
  const [imgSrc, setImgSrc] = useState(movie?.poster || PLACEHOLDER);
  const {
    title = "Untitled",
    release_date,
    overview,
    color1,
    color2,
    director,
  } = movie || {};

  const year = release_date ? String(release_date).split("-")[0] : "—";

  const gradient = `linear-gradient(135deg, ${color1 || "#1f2937"}, ${color2 || "#374151"})`;

  return (
    <article
      className={`rounded-xl overflow-hidden transition-all duration-300 cursor-pointer relative flex flex-col ${!isGame ? "sm:flex-row" : "h-96"} shadow-lg bg-bg-card backdrop-blur-md border border-border-theme hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(2,6,23,0.6)] hover:z-10 group`}
      role="article"
      aria-label={`${title} movie card`}
      style={{ background: gradient }}
    >
      <div
        className={`relative w-full overflow-hidden bg-[#111] ${isGame ? "h-0 pt-[130%]" : "h-0 pt-[130%] sm:pt-0 sm:h-auto sm:min-h-[220px] sm:w-[160px] sm:shrink-0"}`}
      >
        <img
          src={imgSrc}
          alt={`${title} poster`}
          loading="lazy"
          className={`absolute top-0 left-0 w-full h-full object-cover block transition-transform duration-600 ease-out group-hover:scale-[1.04] ${!isGame ? "sm:rounded-none" : ""}`}
          onError={() => setImgSrc(PLACEHOLDER)}
        />
        <h2 className="absolute left-3 bottom-3 sm:left-2 sm:bottom-2 m-0 px-2.5 py-1.5 sm:px-2 sm:py-1 bg-[linear-gradient(90deg,rgba(0,0,0,0.6),rgba(0,0,0,0.3))] rounded-lg font-display text-base sm:text-[0.95rem] font-extrabold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] max-w-[calc(100%-24px)] overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </h2>
      </div>

      {!isGame && (
        <div className="p-4 sm:px-6 sm:py-5 flex flex-col gap-2 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] w-full">
          <h3 className="text-lg m-0 text-text-primary leading-[1.15]">
            {title}
          </h3>
          {!hideYear && (
            <div className="text-primary font-bold text-[0.95rem]">{year}</div>
          )}
          {director && (
            <div className="text-[0.9rem] text-text-secondary">
              Dir: {director}
            </div>
          )}
          {overview && (
            <p
              className="text-text-secondary text-[0.95rem] mt-1 leading-[1.4] max-h-[4.2rem] overflow-hidden text-ellipsis line-clamp-3"
              title={overview}
            >
              {truncate(overview, 160)}
            </p>
          )}
        </div>
      )}
    </article>
  );
};

export default React.memo(MovieCard);
