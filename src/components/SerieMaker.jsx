import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Hammer, Pen, Trash } from "lucide-react";

export default function SerieMaker() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [popularity, setPopularity] = useState("");
  const [overview, setOverview] = useState("");
  const [poster, setPoster] = useState("");
  const [series, setSeries] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [search, setSearch] = useState("");
  const [editingSerieId, setEditingSerieId] = useState(null);
  const [notification, setNotification] = useState("");

  const handleEditSerie = (currentSerie) => {
    setTitle(currentSerie.title);
    setDate(currentSerie.date);
    setPopularity(currentSerie.popularity);
    setOverview(currentSerie.overview);
    setPoster(currentSerie.poster);
    setModoEdicion(true);
    setEditingSerieId(currentSerie.id);
  };

  const ponerModoCreacion = () => {
    setTitle("");
    setDate("");
    setPopularity("");
    setOverview("");
    setPoster("");
    setModoEdicion(false);
  };

  const addSerie = async () => {
    if (modoEdicion) {
      const { data, error } = await supabase
        .from("series")
        .update({
          poster,
          popularity,
          title,
          overview,
          release_date: date,
        })
        .eq("id", editingSerieId)
        .select();

      if (error) {
        console.log("error al actualizar", error);
        setNotification("Error al actualizar");
        setTimeout(() => setNotification(null), 3000);
        return;
      }
      setSeries((prev) =>
        prev.map((s) => (s.id === editingSerieId ? data[0] : s)),
      );

      setNotification("Serie actualizada");
      setTimeout(() => setNotification(null), 3000);
    } else {
      const { data, error } = await supabase
        .from("series")
        .insert([{ poster, popularity, title, overview, release_date: date }])
        .select();

      if (error) {
        console.log("error al crear una serie", error);
        setNotification("Error al crear serie");
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      if (data && data.length > 0) {
        setSeries((prev) => [data[0], ...prev]);
      }

      setNotification("Serie creada correctamente");
      setTimeout(() => setNotification(null), 3000);
    }

    setTitle("");
    setDate("");
    setPopularity("");
    setOverview("");
    setPoster("");
    setModoEdicion(false);
    setEditingSerieId(null);
  };

  const searchSeries = async (value) => {
    setSearch(value);

    if (!value) {
      const { data } = await supabase.from("series").select("*");
      if (data) setSeries(data);
      return;
    }

    const { data, error } = await supabase
      .from("series")
      .select("*")
      .ilike("title", `%${value}%`);

    if (error) {
      console.log("error buscando series", error);
      return;
    }

    setSeries(data);
  };

  const deleteSerie = async (id) => {
    if (modoEdicion) return;
    const { error } = await supabase.from("series").delete().eq("id", id);

    if (error) {
      console.log("error al eliminar serie");
    }

    setSeries((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    const getSeries = async () => {
      let { data, error } = await supabase.from("series").select("*");

      if (error) {
        console.log("error al traer series");
      }

      if (data) {
        setSeries(data);
      }
    };
    getSeries();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-2">Serie Maker</h1>
      <p className="text-gray-400 mb-8">Aquí podrás crear tu propia serie</p>

      <div className="flex gap-10">
        <section className="w-1/2  text-white rounded-2xl p-8 shadow-lg">
          <div className="flex gap-2 p-2">
            <div
              className={`rounded-3xl w-40  py-2 px-4 flex items-center gap-2 ${modoEdicion ? "bg-sky-500 " : "bg-green-500"}`}
            >
              {modoEdicion ? (
                <>
                  <Pen /> Editando
                </>
              ) : (
                <>
                  <Hammer /> Creando
                </>
              )}
            </div>
            <button
              onClick={ponerModoCreacion}
              className={`rounded-full bg-green-500 p-2 ${modoEdicion ? "" : "opacity-0"} cursor-pointer`}
            >
              <Hammer />
            </button>
          </div>
          <div className="flex justify-center mb-8 bg-">
            <div className="relative w-72 h-96 overflow-hidden rounded-xl border-2 border-yellow-400 shadow-lg">
              <img src={poster} className="h-full w-full object-cover" alt="" />

              <div className="absolute top-3 left-3 bg-yellow-400 text-black font-bold text-sm px-3 py-1 rounded-full shadow">
                {popularity}
              </div>

              <div className="absolute bottom-0 w-full  bg-yellow-400/50 text-black p-4">
                <p className="font-bold text-lg leading-tight">{title}</p>

                <span className="text-sm text-gray-300">{date}</span>
              </div>
            </div>
          </div>

          <form className="max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">
                  Título
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-black border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-black border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg bg-black border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Popularidad
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-black border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={popularity}
                  onChange={(e) => setPopularity(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">
                  Poster
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-black border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={poster}
                  onChange={(e) => setPoster(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={addSerie}
                className={`${modoEdicion ? "bg-blue-500" : "bg-yellow-400"} text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition-transform`}
              >
                {modoEdicion ? "Actualizar Serie" : "Crear Serie"}
              </button>
            </div>
          </form>
        </section>

        <section className="w-1/2 flex flex-col gap-6 ">
          <div className="bg-black border border-yellow-400 rounded-2xl p-6 shadow-lg flex-1">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-yellow-400 pb-2">
              Series creadas
            </h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar serie..."
                value={search}
                onChange={(e) => searchSeries(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black border border-yellow-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 h-[800px] overflow-y-scroll">
              {series &&
                series.map((s) => (
                  <div
                    className="overflow-hidden h-52 rounded-lg border border-yellow-400 cursor-pointer relative group"
                    key={s.id}
                  >
                    <img
                      className="w-full h-56 object-cover"
                      src={s.poster}
                      alt=""
                    />
                    <div className="absolute flex gap-2 top-0 p-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="bg-red-600/70 text-white p-2 rounded-2xl cursor-pointer"
                        onClick={() => deleteSerie(s.id)}
                      >
                        <Trash />
                      </button>
                      <button
                        className="bg-blue-600/70 rounded-4xl p-2 text-white cursor-pointer"
                        onClick={() => handleEditSerie(s)}
                      >
                        <Pen />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
      {notification && (
        <div className="fixed bottom-5 right-5 flex items-start gap-3 bg-[#111111] text-white px-4 py-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-yellow-400/20 animate-in fade-in slide-in-from-bottom-4 duration-300 min-w-[280px] max-w-[360px]">
          <div className="w-1 self-stretch rounded-full bg-yellow-400 shrink-0" />

          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-0.5">
              Notificación
            </p>
            <p className="text-sm text-white/85 leading-snug">{notification}</p>
          </div>
          <button className="shrink-0 mt-0.5 text-white/30 hover:text-yellow-400 transition-colors duration-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
