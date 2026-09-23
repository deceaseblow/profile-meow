import React from "react";
import { useAppData } from "../context/AppDataContext";

const fontStyle = {
  fontFamily: "'antsValley', sans-serif"
};

function Games() {
  const { data, loading } = useAppData();

  if (loading) return <p className="text-center mt-4 text-gray-500">Loading games...</p>;
  if (!data?.games || data.games.length === 0)
    return <p className="text-center text-gray-400">No games available.</p>;

  return (
    <div className="px-6 md:px-10 mx-auto space-y-12">
      {data.games.map((gameCategory) => (
        <div key={gameCategory.name}>
          <h2
            className="text-center text-[22px] md:text-[40px] font-bold mb-4 capitalize text-black tracking-wider border-b-2 border-gray-800 pb-2 md:text-start"
            style={fontStyle}
          >
            {gameCategory.name} Games
          </h2>

          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {gameCategory.links.map((link) => (
              <div
                key={link.url}
                className="w-72 bg-white border border-black rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6"
                >
                  <h3
                    className="text-lg md:text-xl font-bold text-black uppercase tracking-wide text-center mb-3
                               transition-colors duration-200 group-hover:text-white group-hover:bg-black rounded-lg py-1"
                  >
                    {link.name}
                  </h3>

                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    {link.description}
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Games;
    