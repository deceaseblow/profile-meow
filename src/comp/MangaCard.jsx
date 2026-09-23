import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  deleteDocument,
  updateDocument,
} from "../services/firestoreService";

export default function MangaCard({ manga }) {
  const fallbackImage =
    "https://dennymfg.com/cdn/shop/products/ckgrayHigh_grande.jpg?v=1619109728";

  const { isAdmin, login } = useAuth();

  const [editing, setEditing] = useState(false);

  const [editManga, setEditManga] = useState({
    title: manga.title || "",
    author: manga.author || "",
    year: manga.year || "",
    genres: manga.genres || [],
    status: manga.status || "reading",
    comment: manga.comment || "",
    image: manga.image || "",
    link: manga.link || "",
  });

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

  const mangaPath = `/mangas/${manga.title
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  const handleClick = () => {
    if (editing) return;

    localStorage.setItem(
      "lastChosenManga",
      JSON.stringify(manga)
    );
  };

  const ensureAdmin = async () => {
    if (isAdmin) {
      return true;
    }

    try {
      await login();
      return true;
    } catch (error) {
      console.error("Admin authentication failed:", error);

      alert(
        "You need to log in with the authorized Google account."
      );

      return false;
    }
  };

  const handleDelete = async () => {
    const authenticated = await ensureAdmin();

    if (!authenticated) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${manga.title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteDocument(
        "manga",
        manga.firestoreId
      );

      alert("Manga deleted successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error deleting manga:", error);
      alert("Failed to delete manga.");
    }
  };

  const handleEditClick = async () => {
    const authenticated = await ensureAdmin();

    if (!authenticated) return;

    setEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateDocument(
        "manga",
        manga.firestoreId,
        {
          ...editManga,
          year: editManga.year
            ? Number(editManga.year)
            : null,
        }
      );

      alert("Manga updated successfully!");

      setEditing(false);

      window.location.reload();
    } catch (error) {
      console.error("Error updating manga:", error);
      alert("Failed to update manga.");
    }
  };

  /*
   * EDIT MODE
   *
   * The edit form is completely outside the normal
   * manga card instead of being rendered inside it.
   */
  if (editing) {
    return (
      <div className="w-full max-w-3xl bg-white border border-gray-700 rounded-lg shadow-lg p-5 sm:p-6 md:p-8 text-black">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-bold">
            Edit Manga
          </h3>
        </div>

        <form
          onSubmit={handleUpdate}
          className="flex flex-col gap-4"
        >
          {/* TITLE */}

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Title
            </label>

            <input
              type="text"
              value={editManga.title}
              onChange={(e) =>
                setEditManga({
                  ...editManga,
                  title: e.target.value,
                })
              }
              required
              className="w-full px-3 py-2 border border-gray-400 rounded text-black"
            />
          </div>

          {/* AUTHOR */}

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Author
            </label>

            <input
              type="text"
              value={editManga.author}
              onChange={(e) =>
                setEditManga({
                  ...editManga,
                  author: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-400 rounded text-black"
            />
          </div>

          {/* YEAR */}

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Year
            </label>

            <input
              type="number"
              value={editManga.year}
              onChange={(e) =>
                setEditManga({
                  ...editManga,
                  year: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-400 rounded text-black"
            />
          </div>

          {/* GENRES */}

          <div>
            <label className="block mb-2 font-semibold">
              Genres
            </label>

            <div className="border border-gray-400 rounded p-3 bg-gray-50 max-h-52 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {genres.map((genre) => (
                  <label
                    key={genre}
                    className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={editManga.genres.includes(
                        genre
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditManga({
                            ...editManga,
                            genres: [
                              ...editManga.genres,
                              genre,
                            ],
                          });
                        } else {
                          setEditManga({
                            ...editManga,
                            genres:
                              editManga.genres.filter(
                                (item) =>
                                  item !== genre
                              ),
                          });
                        }
                      }}
                    />

                    {genre}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* STATUS */}

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Status
            </label>

            <select
              value={editManga.status}
              onChange={(e) =>
                setEditManga({
                  ...editManga,
                  status: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-400 rounded text-black"
            >
              <option value="reading">
                Reading
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="planned">
                Planned
              </option>

              <option value="dropped">
                Dropped
              </option>
            </select>
          </div>

          {/* COMMENT */}

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Comment
            </label>

            <textarea
              value={editManga.comment}
              onChange={(e) =>
                setEditManga({
                  ...editManga,
                  comment: e.target.value,
                })
              }
              rows="4"
              className="w-full px-3 py-2 border border-gray-400 rounded text-black resize-y"
            />
          </div>

          {/* IMAGE */}

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Image URL
            </label>

            <input
              type="url"
              value={editManga.image}
              onChange={(e) =>
                setEditManga({
                  ...editManga,
                  image: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-400 rounded text-black"
            />
          </div>

          {/* READ LINK */}

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Read Link
            </label>

            <input
              type="url"
              value={editManga.link}
              onChange={(e) =>
                setEditManga({
                  ...editManga,
                  link: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-400 rounded text-black"
            />
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-black text-white rounded hover:bg-gray-700 transition font-semibold"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 px-4 py-3 bg-gray-300 text-black rounded hover:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  /*
   * NORMAL MANGA CARD
   */

  return (
    <div
      className="bg-white border border-gray-700 shadow-[0_0_15px_rgba(255,255,255,0.05)] overflow-hidden rounded-lg transition-transform duration-300 w-40 sm:w-56 md:w-64"
      onClick={handleClick}
    >
      {/* IMAGE */}

      <Link to={mangaPath} className="block">
        <img
          src={
            manga.image &&
            manga.image.trim() !== ""
              ? manga.image
              : fallbackImage
          }
          alt={manga.title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
          className="w-full h-56 sm:h-64 md:h-80 object-cover bg-gray-900 filter transition duration-300"
        />
      </Link>

      {/* CARD CONTENT */}

      <div className="p-3 sm:p-4 flex flex-col gap-2 text-[#000]">
        <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
          {manga.title}
        </h2>

        <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
          {manga.genres &&
          manga.genres.length > 0 ? (
            manga.genres.map((genre, index) => (
              <span
                key={`${genre}-${index}`}
                className="border bg-[#000] border-gray-500 text-white text-[9px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full tracking-wide uppercase"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="border border-gray-600 text-gray-400 text-[10px] sm:text-xs px-2 py-1 rounded-full">
              Unknown
            </span>
          )}
        </div>

        <p className="mt-2 text-[10px] sm:text-[11px] text-[#000] uppercase font-bold">
          Status :{" "}
          <span
            className={`font-semibold ${
              manga.status === "completed"
                ? "text-[#000]"
                : "text-red-400"
            }`}
          >
            {manga.status || "Unknown"}
          </span>
        </p>

        {/* ADMIN BUTTONS */}

        {isAdmin && (
          <div
            className="flex gap-2 mt-3"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={handleEditClick}
              className="flex-1 px-3 py-2 bg-black text-white rounded hover:bg-gray-700 transition text-xs sm:text-sm"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-300 transition text-xs sm:text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 