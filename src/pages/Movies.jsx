import { useState } from "react";

import MovieCard from "../comp/MovieCard";

import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

import { addDocument } from "../services/firestoreService";

const fontStyle = {
  fontFamily: "'antsValley', sans-serif",
};

const movieGenres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Fantasy",
  "Animation",
];

const Movies = () => {
  const { data, loading } = useAppData();
  const { isAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] =
    useState("All");
  const [visibleCount, setVisibleCount] =
    useState(10);

  const [adding, setAdding] = useState(false);

  const [newMovie, setNewMovie] = useState({
    title: "",
    year: "",
    status: "watched",
    genres: [],
    comment: "",
    image: "",
  });

  if (loading) {
    return (
      <div className="pb-10 px-4 md:px-10">
        <h2
          className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
          style={fontStyle}
        >
          Movies
        </h2>

        <p className="text-center mt-4">
          Loading movies...
        </p>
      </div>
    );
  }

  if (!data?.movies || data.movies.length === 0) {
    return (
      <p className="text-center text-gray-400">
        No movies available.
      </p>
    );
  }

  const genres = ["All", ...movieGenres];

  const fuzzyMatch = (str, query) => {
    if (!str || !query) return false;

    str = str.toLowerCase();
    query = query.toLowerCase();

    return [...query].every((char) =>
      str.includes(char)
    );
  };

  const filteredMovies = data.movies.filter(
    (movie) => {
      const matchesSearch = searchTerm
        ? movie.title &&
          fuzzyMatch(movie.title, searchTerm)
        : true;

      const matchesGenre =
        selectedGenre === "All"
          ? true
          : movie.genres?.some(
              (genre) =>
                genre.toLowerCase() ===
                selectedGenre.toLowerCase()
            );

      return matchesSearch && matchesGenre;
    }
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleNewMovieChange = (e) => {
    const { name, value } = e.target;

    setNewMovie((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenreChange = (genre) => {
    setNewMovie((prev) => {
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

  const handleAddMovie = async (e) => {
    e.preventDefault();

    if (!newMovie.title.trim()) {
      alert("Please enter a movie title.");
      return;
    }

    try {
      await addDocument("movies", {
        title: newMovie.title.trim(),
        year: newMovie.year
          ? Number(newMovie.year)
          : null,
        status: newMovie.status,
        genres: newMovie.genres,
        comment: newMovie.comment.trim(),
        image: newMovie.image.trim(),
      });

      alert("Movie added successfully!");

      setNewMovie({
        title: "",
        year: "",
        status: "watched",
        genres: [],
        comment: "",
        image: "",
      });

      setAdding(false);

      window.location.reload();
    } catch (error) {
      console.error(
        "Error adding movie:",
        error
      );

      alert("Failed to add movie.");
    }
  };

  return (
    <div className="pb-10 px-4 md:px-10">
      <h2
        className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
        style={fontStyle}
      >
        Movies
      </h2>

      {/* ADD MOVIE BUTTON */}
      {isAdmin && !adding && (
        <div className="flex justify-center md:justify-start mb-6">
          <button
            onClick={() => setAdding(true)}
            className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition"
          >
            + Add Movie
          </button>
        </div>
      )}

      {/* ADD MOVIE FORM */}
      {isAdmin && adding && (
        <div className="w-full max-w-xl mb-8 bg-white border border-gray-400 rounded-lg p-4 sm:p-6 text-black">
          <h3 className="text-xl font-bold mb-5">
            Add New Movie
          </h3>

          <form
            onSubmit={handleAddMovie}
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
                value={newMovie.title}
                onChange={handleNewMovieChange}
                placeholder="Movie title"
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
                value={newMovie.year}
                onChange={handleNewMovieChange}
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
                value={newMovie.status}
                onChange={handleNewMovieChange}
                className="w-full border border-gray-400 rounded px-3 py-2 bg-white"
              >
                <option value="watched">
                  Watched
                </option>

                <option value="watching">
                  Watching
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
                  {movieGenres.map((genre) => (
                    <label
                      key={genre}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newMovie.genres.includes(
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
                value={newMovie.comment}
                onChange={handleNewMovieChange}
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
                value={newMovie.image}
                onChange={handleNewMovieChange}
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
                Add Movie
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdding(false);

                  setNewMovie({
                    title: "",
                    year: "",
                    status: "watched",
                    genres: [],
                    comment: "",
                    image: "",
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RESULT COUNT */}
      <p className="text-center text-[22px] font-bold text-black md:text-start md:text-[20px]">
        {filteredMovies.length === 0
          ? "No movies found for your search."
          : `Currently ${filteredMovies.length} ${
              filteredMovies.length === 1
                ? "movie is"
                : "movies are"
            } found for your search.`}
      </p>

      <div className="flex flex-col items-center">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(10);
          }}
          className="my-6 w-72 sm:w-80 px-4 py-2 rounded-full border border-gray-400 bg-white text-black font-mono text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-black placeholder-gray-500 placeholder:italic transition-all duration-200"
        />

        {/* GENRE FILTER */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre);
                setVisibleCount(10);
              }}
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

        {/* MOVIES */}
        <div className="flex flex-wrap gap-3 justify-center">
          {filteredMovies
            .slice(0, visibleCount)
            .map((movie) => (
              <MovieCard
                key={
                  movie.firestoreId || movie.id
                }
                movie={movie}
              />
            ))}
        </div>

        {/* LOAD MORE */}
        {visibleCount <
          filteredMovies.length && (
          <button
            onClick={handleLoadMore}
            className="mt-6 px-6 py-3 bg-black hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition duration-300 cursor-pointer"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Movies;