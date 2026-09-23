import { useState } from "react";
import FooterDivider from "../assets/FooterDivider.png";
import ShowsCard from "../comp/ShowsCard";
import { useAppData } from "../context/AppDataContext";

const fontStyle = {
  fontFamily: "'antsValley', sans-serif",
};

export default function Animes() {
  const { data, loading } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);

  if (loading) {
    return (
      <div className="pb-10 px-4 md:px-10">
        <h2
          className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
          style={fontStyle}
        >
          Animes
        </h2>
        <p className="text-center text-lg">Loading animes...</p>
      </div>
    );
  }

  if (!data?.animes || data.animes.length === 0) {
    return (
      <div className="pb-10 px-4 md:px-10">
        <h2
          className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
          style={fontStyle}
        >
          Animes
        </h2>
        
        <div className="text-center">
          <div className="h-80 flex items-center justify-center mb-6 sm:h-160">
            <h1>Nothing to see here yet...</h1>
          </div>
          <div className="flex justify-center">
            <img
              src={FooterDivider}
              alt=""
              className="block sm:hidden w-full max-w-xs"
            />
            <div className="hidden sm:flex w-full justify-between gap-2">
              <img src={FooterDivider} alt="" className="w-1/4" />
              <img src={FooterDivider} alt="" className="w-1/4" />
              <img src={FooterDivider} alt="" className="w-1/4" />
              <img src={FooterDivider} alt="" className="w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // fuzzy search
  const fuzzyMatch = (str, query) => {
    if (!str || !query) return false;
    str = str.toLowerCase();
    query = query.toLowerCase();
    return [...query].every((char) => str.includes(char));
  };

  // collect genres from data
  const genres = ["All", ...new Set(data.animes.flatMap((a) => a.genres || []))];

  // filtering
  const filteredAnimes = data.animes.filter((anime) => {
    const matchesSearch = searchTerm
      ? fuzzyMatch(anime.title, searchTerm)
      : true;
    const matchesGenre =
      selectedGenre === "All" ||
      anime.genres?.some(
        (g) => g.toLowerCase() === selectedGenre.toLowerCase()
      );
    return matchesSearch && matchesGenre;
  });

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="pb-10 px-4 md:px-10">
      <h2
        className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
        style={fontStyle}
      >
        Animes
      </h2>
       <p className="text-center text-[22px] font-bold text-black md:text-start md:text-[20px]">
        Currently {filteredAnimes.length === 0 ? 'no' : filteredAnimes.length}{" "}
        {filteredAnimes.length === 1 ? 'anime is' : 'animes are'} found for your search.
      </p>


      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Search animes..."
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

        <div className="flex flex-wrap gap-3 justify-center">
          {filteredAnimes.slice(0, visibleCount).map((anime, index) => (
            <ShowsCard key={index} show={anime} />
          ))}
        </div>

        {visibleCount < filteredAnimes.length && (
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
}
