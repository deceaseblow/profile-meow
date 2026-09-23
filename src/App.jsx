import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { AppDataProvider } from "./context/AppDataContext";
import "./App.css"
import Home from "./pages/Home";
import Animes from "./pages/Animes";
import MangaList from "./pages/MangaList";
import Pfp from "./comp/pfp";
import Games from "./pages/Games";
import Blogs from "./pages/Blogs";
import Gallery from "./pages/Gallery";
import DividerTop from "./comp/dividerTop";
import Links from "./pages/Links";
import Shows from "./pages/Shows";
import Movies from "./pages/Movies";
import DividerBot from "./comp/dividerBot";
import Music from "./pages/Music";
import MangaPage from "./pages/MangaPage";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppDataProvider>
          <div className="flex flex-col md:flex-row h-screen bg-gray-100 beaufort">
            <div className="w-full md:w-64 bg-[#000] text-white flex flex-col justify-between md:h-screen md:sticky md:top-0">
              <div>
                <DividerTop />
                <div className="flex items-center justify-center py-3">
                  <NavLink
                    to="/">
                    <Pfp />
                  </NavLink>
                </div>
                <nav className="flex flex-col">
                  <div>
                    <div className="flex flex-wrap gap-1 md:flex md:flex-col md:gap-0 md:p-0 justify-center">
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          `px-2 py-2 md:px-4 md:py-1 transition text-center text-sm md:text-base ${isActive ? "bg-[#fff] text-[#000]" : ""
                          }`
                        }
                      >
                        Home
                      </NavLink>
                      <NavLink
                        to="/blogs"
                        className={({ isActive }) =>
                          `px-2 py-2 md:px-4 md:py-1 transition text-center text-sm md:text-base ${isActive ? "bg-[#fff] text-[#000]" : ""
                          }`
                        }
                      >
                        Blog
                      </NavLink>
                      <NavLink
                        to="/links"
                        className={({ isActive }) =>
                          `px-2 py-2 md:px-4 md:py-1 transition text-center text-sm md:text-base ${isActive ? "bg-[#fff] text-[#000]" : ""
                          }`
                        }
                      >
                        Links
                      </NavLink>
                      <NavLink
                        to="/mangas"
                        className={({ isActive }) =>
                          `px-2 py-2 md:px-4 md:py-1 transition text-center text-sm md:text-base ${isActive ? "bg-[#fff] text-[#000]" : ""
                          }`
                        }
                      >
                        Manga
                      </NavLink>
                      {/*
                    <NavLink
                      to="/animes"
                      className={({ isActive }) =>
                        `px-2 py-2 md:px-4 md:py-1 transition text-center text-sm md:text-base ${isActive ? "bg-[#fff] text-[#000]" : ""
                        }`
                      }
                    >
                      Anime
                    </NavLink>
                   
                    <NavLink
                      to="/games"
                      className={({ isActive }) =>
                        `px-2 py-2 md:px-4 md:py-1 transition text-center text-sm md:text-base ${isActive ? "bg-[#fff] text-[#000]" : ""
                        }`
                      }
                    >
                      Games
                    </NavLink> */}

                      {/* 
                    <NavLink
                      to="/gallery"
                      className={({ isActive }) =>
                        `px-2 py-2 md:px-4 md:py-1 transition text-center text-sm md:text-base ${isActive ? "bg-[#fff] text-[#000]" : ""
                        }`
                      }
                    >
                      Gallery
                    </NavLink>
                    */}

                      <NavLink
                        to="/shows"
                        className={({ isActive }) =>
                          `px-2 py-2 md:px-4 md:py-1 transition text-center text-sm md:text-base ${isActive ? "bg-[#fff] text-[#000]" : ""
                          }`
                        }
                      >
                        Shows
                      </NavLink>
                      <NavLink
                        to="/movies"
                        className={({ isActive }) =>
                          `px-2 py-2 md:px-4 md:py-1 transition text-center text-sm md:text-base ${isActive ? "bg-[#fff] text-[#000]" : ""
                          }`
                        }
                      >
                        Movies
                      </NavLink>
                      {/*<NavLink 
                      to="/music  "
                      className={({ isActive }) =>
                        `px-2 py-2 md:px-4 md:py-1 transition text-center text-sm md:text-base ${isActive ? "bg-[#fff] text-[#000]" : ""
                        }`
                      }
                    >
                      Music
                    </NavLink> */}
                    </div>
                  </div>
                </nav>
              </div>
              <div className="hidden md:block">
                <div>
                  <DividerBot />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pt-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mangas" element={<MangaList />} />
                <Route path="/animes" element={<Animes />} />
                {/* <Route path="/games" element={<Games />} /> */}
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/links" element={<Links />} />
                <Route path="/shows" element={<Shows />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/mangas/:name" element={<MangaPage />} />
                {/* <Route path="/music" element={<Music />} /> */}
              </Routes>
            </div>
          </div>
        </AppDataProvider>
      </AuthProvider>
    </Router>
  );
}