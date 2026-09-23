import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

import Socials from "../comp/Socials";
import ListKeep from "../comp/ListKeep";

const fontStyle = {
  fontFamily: "'antsValley', sans-serif",
};

export default function Home() {
  const { data, loading } = useAppData();

  const {
    isAdmin,
    login,
    logout,
    loading: authLoading,
  } = useAuth();

  const handleAdminLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Admin authentication failed:", error);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Admin logout failed:", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-4">
        Loading list...
      </p>
    );
  }

  return (
    <div>
      <div className="pb-6 px-3 h-[500px] md:px-10">
        <h2
          className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 items-center border-black pb-2 md:text-start md:text-[40px] md:items-start"
          style={fontStyle}
        >
          Home
        </h2>

        <div className="flex flex-col gap-5 px-5 md:pl-10 md:pt-10">
          <Socials />
          <ListKeep />

          {/* ADMIN AUTH */}

          {!isAdmin ? (
            <button
              onClick={handleAdminLogin}
              disabled={authLoading}
              className="px-4 py-2 bg-black text-white rounded w-fit hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? "Logging in..." : "Login to Edit"}
            </button>
          ) : (
            <button
              onClick={handleAdminLogout}
              className="px-4 py-2 bg-black text-white rounded w-fit cursor-pointer"
            >
              Log Out
            </button>
          )}

          {/* <ExamsTable /> */}
        </div>

        <h2 className="deathNote text-4xl text-center">
          important message!
        </h2>

        <p>
          Some shit doesnt work and i dont know yet why, so just ignore it!
          byebye!
        </p>
      </div>
    </div>
  );
}