import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

export default function MangaPage() {
    const { data, loading } = useAppData();

    const mangaList = data?.manga || [];

    // Get the previously selected manga
    const storedManga = localStorage.getItem("lastChosenManga");
    const storedMangaData = storedManga ? JSON.parse(storedManga) : null;

    // Find the actual manga from Firestore data
    const manga = storedMangaData
        ? mangaList.find(
              (item) =>
                  item.firestoreId === storedMangaData.firestoreId ||
                  item.title === storedMangaData.title
          )
        : null;

    if (loading) {
        return (
            <div className="pb-10 px-4 md:px-10 min-h-screen text-black">
                <p className="text-center mt-10">Loading manga...</p>
            </div>
        );
    }

    if (!manga) {
        return (
            <div className="pb-10 px-4 md:px-10 min-h-screen text-black">
                <p className="text-center mt-10">No manga selected.</p>

                <div className="mt-6 text-center">
                    <Link
                        to="/mangas"
                        className="text-black hover:text-gray-700"
                    >
                        &larr; Back to Manga List
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-10 px-4 md:px-10 text-black">
            <div className="mb-4 text-sm sm:text-base">
                <Link
                    to="/mangas"
                    className="text-black hover:text-gray-700"
                >
                    &larr; Back to Manga List
                </Link>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold my-6">
                {manga.title}
            </h1>

            <div className="flex flex-col md:flex-row gap-6">
                <img
                    src={
                        manga.image ||
                        "https://dennymfg.com/cdn/shop/products/ckgrayHigh_grande.jpg?v=1619109728"
                    }
                    alt={manga.title}
                    className="w-full md:w-64 h-auto rounded-lg shadow-lg border border-gray-300 object-cover"
                />

                <div className="flex-1 flex flex-col gap-3">
                    <p>
                        <strong>Author:</strong> {manga.author}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        <span
                            className={
                                manga.status === "completed"
                                    ? "text-black"
                                    : "text-red-500"
                            }
                        >
                            {manga.status || "Unknown"}
                        </span>
                    </p>

                    <p>
                        <strong>Genres:</strong>{" "}
                        {manga.genres?.join(", ") || "Unknown"}
                    </p>

                    <p>
                        <strong>Year:</strong> {manga.year || "Unknown"}
                    </p>

                    <button
                        onClick={() => {
                            if (manga.link) {
                                window.open(manga.link, "_blank");
                            }
                        }}
                        className="w-fit mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-300 hover:text-black transition-colors cursor-pointer"
                    >
                        Read now
                    </button>
                </div>
            </div>
        </div>
    );
}