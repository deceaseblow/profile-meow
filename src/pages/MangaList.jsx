import { useState } from "react";
import MangaCard from "../comp/MangaCard";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";
import { addDocument } from "../services/firestoreService";

const fontStyle = {
  fontFamily: "'antsValley', sans-serif",
};

const MangaList = () => {
  const { data, loading } = useAppData();
  const mangaList = data?.manga || [];

  const { isAdmin } = useAuth();

  const [visibleReading, setVisibleReading] = useState(5);
  const [visibleWillRead, setVisibleWillRead] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const [showAddForm, setShowAddForm] = useState(false);

  const [newManga, setNewManga] = useState({
    title: "",
    author: "",
    year: "",
    genres: [],
    status: "reading",
    comment: "",
    image: "",
    link: "",
  });

  if (loading) {
    return (
      <div className="pb-10 px-4 md:px-10">
        <h2
          className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
          style={fontStyle}
        >
          Manga List
        </h2>

        <p className="text-center text-lg">
          Loading manga...
        </p>
      </div>
    );
  }

  const fuzzyMatch = (str, query) => {
    if (!str || !query) return false;

    str = str.toLowerCase();
    query = query.toLowerCase();

    return [...query].every((char) => str.includes(char));
  };

  const filteredMangas = mangaList.filter((manga) => {
    const matchesSearch = searchTerm
      ? manga.title && fuzzyMatch(manga.title, searchTerm)
      : true;

    const matchesGenre =
      selectedGenre === "All"
        ? true
        : manga.genres?.some(
          (genre) =>
            genre.toLowerCase() === selectedGenre.toLowerCase()
        );

    return matchesSearch && matchesGenre;
  });

  const readingMangas = filteredMangas.filter(
    (manga) => manga.status === "reading"
  );

  const willReadMangas = filteredMangas.filter(
    (manga) => manga.status !== "reading"
  );

  const genres = [
    "All",
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

  const handleAddManga = async (e) => {
    e.preventDefault();

    try {
      await addDocument("manga", {
        ...newManga,
        year: newManga.year ? Number(newManga.year) : null,
      });

      alert("Manga added successfully!");

      setNewManga({
        title: "",
        author: "",
        year: "",
        genres: [],
        status: "reading",
        comment: "",
        image: "",
        link: "",
      });

      setShowAddForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding manga:", error);
      alert("Failed to add manga.");
    }
  };

  return (
    <div className="pb-10 px-4 md:px-10">
      <h2
        className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
        style={fontStyle}
      >
        Manga List
      </h2>

      <p className="text-center text-[22px] font-bold text-black md:text-start md:text-[20px]">
        Currently{" "}
        {filteredMangas.length === 0 ? "no" : filteredMangas.length}{" "}
        {filteredMangas.length === 1
          ? "manga is"
          : "mangas are"}{" "}
        found for your search.
      </p>

      <div className="flex flex-col items-center justify-center">
        <input
          type="text"
          placeholder="Search manga..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="my-6 w-72 sm:w-80 px-4 py-2 rounded-full border border-gray-400 bg-white text-black font-mono text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-black focus:border-black
          placeholder-gray-500 placeholder:italic transition-all duration-200"
        />

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full border transition-all duration-200 ${selectedGenre === genre
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-400 hover:bg-gray-100"
                }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* ADMIN ADD BUTTON */}
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-8 px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition cursor-pointer"
          >
            + Add Manga
          </button>
        )}

        {/* ADD MANGA FORM */}
        {isAdmin && showAddForm && (
          <form
            onSubmit={handleAddManga}
            className="w-full max-w-2xl mb-10 p-6 bg-white border border-gray-400 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6 text-black">
              Add Manga
            </h3>

            <div className="grid gap-4">
              {/* TITLE */}
              <input
                type="text"
                placeholder="Title"
                value={newManga.title}
                onChange={(e) =>
                  setNewManga({
                    ...newManga,
                    title: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-400 rounded text-black"
              />

              {/* AUTHOR */}
              <input
                type="text"
                placeholder="Author"
                value={newManga.author}
                onChange={(e) =>
                  setNewManga({
                    ...newManga,
                    author: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-400 rounded text-black"
              />

              {/* YEAR */}
              <input
                type="number"
                placeholder="Year"
                value={newManga.year}
                onChange={(e) =>
                  setNewManga({
                    ...newManga,
                    year: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-400 rounded text-black"
              />

              {/* GENRES */}

              <div>
                <label className="block mb-2 font-semibold text-black">
                  Genres
                </label>

                <div className="w-full border border-gray-400 rounded p-4 bg-white">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {genres
                      .filter((genre) => genre !== "All")
                      .map((genre) => (
                        <label
                          key={genre}
                          className="flex items-center gap-2 text-black cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={newManga.genres.includes(genre)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewManga({
                                  ...newManga,
                                  genres: [...newManga.genres, genre],
                                });
                              } else {
                                setNewManga({
                                  ...newManga,
                                  genres: newManga.genres.filter(
                                    (item) => item !== genre
                                  ),
                                });
                              }
                            }}
                            className="w-4 h-4"
                          />

                          <span>{genre}</span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <select
                value={newManga.status}
                onChange={(e) =>
                  setNewManga({
                    ...newManga,
                    status: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-400 rounded text-black"
              >
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
                <option value="dropped">Dropped</option>
              </select>

              {/* COMMENT */}
              <textarea
                placeholder="Comment"
                value={newManga.comment}
                onChange={(e) =>
                  setNewManga({
                    ...newManga,
                    comment: e.target.value,
                  })
                }
                rows="3"
                className="w-full px-4 py-2 border border-gray-400 rounded text-black"
              />

              {/* IMAGE */}
              <input
                type="url"
                placeholder="Image URL"
                value={newManga.image}
                onChange={(e) =>
                  setNewManga({
                    ...newManga,
                    image: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-400 rounded text-black"
              />

              {/* READ LINK */}
              <input
                type="url"
                placeholder="Read Link"
                value={newManga.link}
                onChange={(e) =>
                  setNewManga({
                    ...newManga,
                    link: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-400 rounded text-black"
              />

              {/* BUTTONS */}
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded hover:bg-gray-700 transition"
                >
                  Add Manga
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TO-BE READ */}
        <h3 className="text-center text-[30px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[32px]">
          To-be Read
        </h3>

        <div className="py-3 flex flex-wrap gap-3 justify-center">
          {readingMangas.length > 0 ? (
            readingMangas
              .slice(0, visibleReading)
              .map((manga, index) => (
                <MangaCard
                  key={`reading-${index}`}
                  manga={manga}
                />
              ))
          ) : (
            <p className="text-gray-600 italic">
              None found..
            </p>
          )}
        </div>

        {visibleReading < readingMangas.length && (
          <button
            onClick={() =>
              setVisibleReading((prev) => prev + 5)
            }
            className="mt-4 px-6 py-3 bg-black hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition duration-300 cursor-pointer"
          >
            Load More
          </button>
        )}

        {/* READ / FAV LIST */}
        <h3 className="text-center text-[30px] font-bold mb-2 mt-4 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[32px]">
          Read / Fav list
        </h3>

        <div className="py-3 flex flex-wrap gap-3 justify-center">
          {willReadMangas.length > 0 ? (
            willReadMangas
              .slice(0, visibleWillRead)
              .map((manga, index) => (
                <MangaCard
                  key={`willread-${index}`}
                  manga={manga}
                />
              ))
          ) : (
            <p className="text-gray-600 italic">
              None found..
            </p>
          )}
        </div>

        {visibleWillRead < willReadMangas.length && (
          <button
            onClick={() =>
              setVisibleWillRead((prev) => prev + 5)
            }
            className="mt-4 px-6 py-3 bg-black hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition duration-300 cursor-pointer"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default MangaList;