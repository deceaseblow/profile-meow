import { useState } from "react";
import ShowsCard from "../comp/ShowsCard";

import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

import { addDocument } from "../services/firestoreService";

const fontStyle = {
  fontFamily: "'antsValley', sans-serif",
};

const genres = [
  "Romance",
  "Comedy",
  "Drama",
  "Psychological",
  "Horror",
  "GL",
  "BL",
  "Shoujo",
  "Sports",
  "Supernatural",
  "Video Games",
  "College Life",
];

const Shows = () => {
  const { data, loading } = useAppData();
  const { isAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const [adding, setAdding] = useState(false);

  const [newShow, setNewShow] = useState({
    title: "",
    year: "",
    status: "watching",
    genres: [],
    comment: "",
    image: "",
  });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div>
        <div className="pb-10 px-4 md:px-10">
          <h2
            className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
            style={fontStyle}
          >
            Shows
          </h2>

          <p className="text-center mt-4">
            Loading shows...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // NO DATA
  // =========================

  if (!data?.shows || data.shows.length === 0) {
    return (
      <p className="text-center text-gray-400">
        No shows available.
      </p>
    );
  }

  // =========================
  // FUZZY SEARCH
  // =========================

  const fuzzyMatch = (str, query) => {
    if (!str || !query) return false;

    str = str.toLowerCase();
    query = query.toLowerCase();

    return [...query].every((char) =>
      str.includes(char)
    );
  };

  // =========================
  // FILTER SHOWS
  // =========================

  const filteredShows = data.shows.filter((show) => {
    const matchesSearch = searchTerm
      ? show.title &&
        fuzzyMatch(show.title, searchTerm)
      : true;

    const matchesGenre =
      selectedGenre === "All"
        ? true
        : show.genres?.some(
            (genre) =>
              genre.toLowerCase() ===
              selectedGenre.toLowerCase()
          );

    return matchesSearch && matchesGenre;
  });

  // =========================
  // LOAD MORE
  // =========================

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // =========================
  // ADD SHOW INPUT
  // =========================

  const handleNewShowChange = (e) => {
    const { name, value } = e.target;

    setNewShow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // ADD SHOW GENRES
  // =========================

  const handleGenreChange = (genre) => {
    setNewShow((prev) => {
      const alreadySelected =
        prev.genres.includes(genre);

      return {
        ...prev,
        genres: alreadySelected
          ? prev.genres.filter(
              (item) => item !== genre
            )
          : [...prev.genres, genre],
      };
    });
  };

  // =========================
  // ADD SHOW
  // =========================

  const handleAddShow = async (e) => {
    e.preventDefault();

    if (!newShow.title.trim()) {
      alert("Please enter a show title.");
      return;
    }

    try {
      await addDocument("shows", {
        title: newShow.title.trim(),

        year: newShow.year
          ? Number(newShow.year)
          : null,

        status: newShow.status,

        genres: newShow.genres,

        comment: newShow.comment.trim(),

        image: newShow.image.trim(),
      });

      alert("Show added successfully!");

      setNewShow({
        title: "",
        year: "",
        status: "watching",
        genres: [],
        comment: "",
        image: "",
      });

      setAdding(false);

      window.location.reload();
    } catch (error) {
      console.error("Error adding show:", error);
      alert("Failed to add show.");
    }
  };

  // =========================
  // RESET FILTERS
  // =========================

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
    setVisibleCount(10);
  };

  // =========================
  // RESET ADD FORM
  // =========================

  const handleCancelAdd = () => {
    setAdding(false);

    setNewShow({
      title: "",
      year: "",
      status: "watching",
      genres: [],
      comment: "",
      image: "",
    });
  };

  return (
    <div className="pb-10 px-4 md:px-10">

      {/* =========================
          PAGE TITLE
      ========================= */}

      <h2
        className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
        style={fontStyle}
      >
        Shows
      </h2>

      {/* =========================
          ADD SHOW BUTTON
      ========================= */}

      {isAdmin && !adding && (
        <div className="flex justify-center md:justify-start mb-6">
          <button
            onClick={() => setAdding(true)}
            className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition"
          >
            + Add Show
          </button>
        </div>
      )}

      {/* =========================
          ADD SHOW FORM
      ========================= */}

      {isAdmin && adding && (
        <div className="w-full max-w-xl mb-8 bg-white border border-gray-400 rounded-lg p-4 sm:p-6 text-black">
          <h3 className="text-xl font-bold mb-5">
            Add New Show
          </h3>

          <form
            onSubmit={handleAddShow}
            className="flex flex-col gap-4"
          >

            {/* TITLE */}

            <div>
              <label className="block font-semibold mb-1">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={newShow.title}
                onChange={handleNewShowChange}
                placeholder="Show title"
                className="w-full border border-gray-400 rounded px-3 py-2"
                required
              />
            </div>

            {/* YEAR */}

            <div>
              <label className="block font-semibold mb-1">
                Year
              </label>

              <input
                type="number"
                name="year"
                value={newShow.year}
                onChange={handleNewShowChange}
                placeholder="2026"
                className="w-full border border-gray-400 rounded px-3 py-2"
              />
            </div>

            {/* STATUS */}

            <div>
              <label className="block font-semibold mb-1">
                Status
              </label>

              <select
                name="status"
                value={newShow.status}
                onChange={handleNewShowChange}
                className="w-full border border-gray-400 rounded px-3 py-2 bg-white"
              >
                <option value="watching">
                  Watching
                </option>

                <option value="watched">
                  Watched
                </option>

                <option value="dropped">
                  Dropped
                </option>

                <option value="plan to watch">
                  Plan to Watch
                </option>
              </select>
            </div>

            {/* GENRES */}

            <div>
              <label className="block font-semibold mb-2">
                Genres
              </label>

              <div className="border border-gray-400 rounded p-3 bg-gray-50 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                  {genres.map((genre) => (
                    <label
                      key={genre}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newShow.genres.includes(
                          genre
                        )}
                        onChange={() =>
                          handleGenreChange(genre)
                        }
                      />

                      <span>{genre}</span>
                    </label>
                  ))}

                </div>
              </div>
            </div>

            {/* COMMENT */}

            <div>
              <label className="block font-semibold mb-1">
                Comment
              </label>

              <textarea
                name="comment"
                value={newShow.comment}
                onChange={handleNewShowChange}
                placeholder="Your comment..."
                rows={4}
                className="w-full border border-gray-400 rounded px-3 py-2 resize-y"
              />
            </div>

            {/* IMAGE */}

            <div>
              <label className="block font-semibold mb-1">
                Image URL
              </label>

              <input
                type="url"
                name="image"
                value={newShow.image}
                onChange={handleNewShowChange}
                placeholder="https://..."
                className="w-full border border-gray-400 rounded px-3 py-2"
              />
            </div>

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-2">

              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 transition"
              >
                Add Show
              </button>

              <button
                type="button"
                onClick={handleCancelAdd}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* =========================
          RESULT COUNT
      ========================= */}

      <p className="text-center text-[22px] font-bold text-black md:text-start md:text-[20px]">
        Currently{" "}
        {filteredShows.length === 0
          ? "no"
          : filteredShows.length}{" "}
        {filteredShows.length === 1
          ? "show is"
          : "shows are"}{" "}
        found for your search.
      </p>

      <div className="flex flex-col items-center">

        {/* =========================
            SEARCH
        ========================= */}

        <input
          type="text"
          placeholder="Search shows..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(10);
          }}
          className="my-6 w-72 sm:w-80 px-4 py-2 rounded-full border border-gray-400 bg-white text-black font-mono text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-black placeholder-gray-500 placeholder:italic transition-all duration-200"
        />

        {/* =========================
            GENRE FILTERS
        ========================= */}

        <div className="flex flex-wrap gap-2 mb-6 justify-center max-w-5xl">

          {["All", ...genres].map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreFilter(genre)}
              className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedGenre === genre
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-400 hover:bg-gray-100"
              }`}
            >
              {genre}
            </button>
          ))}

        </div>

        {/* =========================
            SHOW CARDS
        ========================= */}

        <div className="flex flex-wrap gap-3 justify-center">

          {filteredShows
            .slice(0, visibleCount)
            .map((show) => (
              <ShowsCard
                key={show.firestoreId || show.id}
                show={show}
              />
            ))}

        </div>

        {/* =========================
            NO SEARCH RESULTS
        ========================= */}

        {filteredShows.length === 0 && (
          <p className="text-gray-500 mt-6">
            No shows match your search or selected genre.
          </p>
        )}

        {/* =========================
            LOAD MORE
        ========================= */}

        {visibleCount < filteredShows.length && (
          <button
            onClick={handleLoadMore}
            className="mt-6 px-6 py-3 bg-black hover:bg-[#fff] text-white font-semibold rounded-lg shadow-md transition duration-300 cursor-pointer hover:text-black"
          >
            Load More
          </button>
        )}

      </div>
    </div>
  );
};

export default Shows;