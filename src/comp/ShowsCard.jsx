import { useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  deleteDocument,
  updateDocument,
} from "../services/firestoreService";

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

const ShowsCard = ({ show }) => {
  const { isAdmin } = useAuth();

  const [editing, setEditing] = useState(false);

  const [editShow, setEditShow] = useState({
    title: show.title || "",
    year: show.year || "",
    status: show.status || "watching",
    genres: show.genres || [],
    comment: show.comment || "",
    image: show.image || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditShow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenreChange = (genre) => {
    setEditShow((prev) => {
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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${show.title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteDocument(
        "shows",
        show.firestoreId
      );

      alert("Show deleted successfully!");

      window.location.reload();
    } catch (error) {
      console.error(
        "Error deleting show:",
        error
      );

      alert("Failed to delete show.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editShow.title.trim()) {
      alert("Please enter a show title.");
      return;
    }

    try {
      await updateDocument(
        "shows",
        show.firestoreId,
        {
          title: editShow.title.trim(),
          year: editShow.year
            ? Number(editShow.year)
            : null,
          status: editShow.status,
          genres: editShow.genres,
          comment: editShow.comment.trim(),
          image: editShow.image.trim(),
        }
      );

      alert("Show updated successfully!");

      setEditing(false);

      window.location.reload();
    } catch (error) {
      console.error(
        "Error updating show:",
        error
      );

      alert("Failed to update show.");
    }
  };

  if (editing) {
    return (
      <div className="w-full max-w-md sm:w-80 bg-white border border-gray-400 rounded-lg p-4 text-black">
        <h3 className="text-xl font-bold mb-4">
          Edit Show
        </h3>

        <form
          onSubmit={handleUpdate}
          className="flex flex-col gap-3"
        >
          {/* TITLE */}
          <div>
            <label className="block font-semibold mb-1">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={editShow.title}
              onChange={handleChange}
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
              value={editShow.year}
              onChange={handleChange}
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
              value={editShow.status}
              onChange={handleChange}
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
              <div className="grid grid-cols-2 gap-2">
                {genres.map((genre) => (
                  <label
                    key={genre}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={editShow.genres.includes(
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
              value={editShow.comment}
              onChange={handleChange}
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
              value={editShow.image}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded px-3 py-2"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 transition"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-40 sm:w-52 md:w-60 bg-[#fff] border border-gray-700 shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-lg overflow-hidden transition-transform duration-300">
      <img
        src={show.image}
        alt={show.title}
        loading="lazy"
        decoding="async"
        className="w-full h-56 sm:h-64 md:h-80 object-cover bg-gray-900"
      />

      <div className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col gap-1.5 sm:gap-2 text-white">
        <h3 className="text-[#000] font-bold text-sm sm:text-base md:text-lg uppercase tracking-wide leading-tight">
          {show.title}
        </h3>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[#000] text-[10px] sm:text-xs italic">
          <p>{show.year || "N/A"}</p>

          <span>•</span>

          {show.status && (
            <p
              className={`font-semibold uppercase ${
                show.status === "watched"
                  ? "text-[#000]"
                  : "text-red-400"
              }`}
            >
              {show.status}
            </p>
          )}
        </div>

        <p className="flex flex-wrap gap-1 text-[10px] sm:text-xs text-[#000] mt-1 font-bold">
          Genres:&nbsp;

          {show.genres &&
          show.genres.length > 0 ? (
            show.genres.map((genre, index) => (
              <span
                key={index}
                className="border border-gray-500 bg-[#000] text-[#fff] text-[9px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full tracking-wide uppercase"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="text-gray-500">
              Unknown
            </span>
          )}
        </p>

        {show.comment && (
          <p className="text-xs sm:text-sm font-bold italic text-gray-300 mt-2">
            “{show.comment}”
          </p>
        )}

        {/* ADMIN CONTROLS */}
        {isAdmin && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-700 transition"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-400 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowsCard;